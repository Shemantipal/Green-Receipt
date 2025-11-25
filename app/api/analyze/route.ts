import { NextRequest, NextResponse } from 'next/server';
import { createWorker } from 'tesseract.js';

// Type definitions
interface ReceiptItem {
  name: string;
  quantity: number;
  price: number;
  carbonFootprint: number;
  waterUsage: number;
  packagingWaste: number;
  ecoRating: 'A' | 'B' | 'C' | 'D' | 'F';
  alternatives: string[];
}

interface AnalysisResult {
  id: string;
  items: ReceiptItem[];
  totals: {
    carbonFootprint: number;
    waterUsage: number;
    packagingWaste: number;
    totalPrice: number;
  };
  overallRating: 'A' | 'B' | 'C' | 'D' | 'F';
  timestamp: string;
}

// Helper function to perform OCR on image/PDF
async function performOCR(file: File): Promise<string> {
  const worker = await createWorker('eng', 1, {
    workerPath: 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/worker.min.js',
    langPath: 'https://tessdata.projectnaptha.com/4.0.0',
    corePath: 'https://cdn.jsdelivr.net/npm/tesseract.js-core@5/tesseract-core.wasm.js',
    logger: m => console.log('OCR:', m.status, m.progress)
  });

  try {
    console.log('Starting OCR processing...');
    
    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Perform OCR
    const { data: { text, confidence } } = await worker.recognize(buffer);
    
    console.log('OCR completed. Confidence:', confidence);
    console.log('Extracted text preview:', text.substring(0, 200));
    
    await worker.terminate();
    
    return text;
  } catch (error) {
    await worker.terminate();
    console.error('OCR error:', error);
    throw new Error('Failed to extract text from image');
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get the file from form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    console.log('Processing file:', file.name, file.type);

    // Step 1: Extract text using Tesseract OCR
    const extractedText = await performOCR(file);
    console.log('Extracted text length:', extractedText.length);
    
    if (!extractedText || extractedText.trim().length === 0) {
      return NextResponse.json(
        { error: 'No text could be extracted from the image' },
        { status: 400 }
      );
    }

    // Step 2: Send extracted text to Claude for analysis
    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        messages: [
          {
            role: 'user',
            content: `I have extracted text from a receipt using OCR. Please analyze it and extract all items with their environmental impact.

OCR TEXT:
${extractedText}

IMPORTANT: Return ONLY valid JSON, no markdown, no explanations, no preamble.

For each item on the receipt, estimate:
- Carbon footprint in kg CO2 (based on product lifecycle)
- Water usage in liters (based on production)
- Packaging waste in grams (estimate plastic/paper)
- Eco rating: A (excellent) to F (poor)
- 2-3 eco-friendly alternatives

Return this exact JSON structure:
{
  "items": [
    {
      "name": "Product name",
      "quantity": 1,
      "price": 9.99,
      "carbonFootprint": 2.5,
      "waterUsage": 150,
      "packagingWaste": 50,
      "ecoRating": "B",
      "alternatives": ["Eco alternative 1", "Eco alternative 2"]
    }
  ],
  "totals": {
    "carbonFootprint": 10.5,
    "waterUsage": 500,
    "packagingWaste": 200,
    "totalPrice": 45.99
  },
  "overallRating": "C"
}

Parse the OCR text carefully. Look for item names, quantities, and prices. Handle OCR errors gracefully (common mistakes like O/0, I/1, etc.).`
          },
        ],
      }),
    });

    if (!claudeResponse.ok) {
      const errorText = await claudeResponse.text();
      console.error('Claude API error:', errorText);
      throw new Error(`Claude API failed: ${claudeResponse.status}`);
    }

    const claudeData = await claudeResponse.json();
    console.log('Claude response received');

    // Extract the text content
    let responseText = '';
    if (claudeData.content && claudeData.content[0]) {
      responseText = claudeData.content[0].text || '';
    }

    // Clean up the response (remove markdown if present)
    responseText = responseText
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    // Parse the JSON response
    const analysisData = JSON.parse(responseText);

    // Create a unique ID for this analysis
    const analysisId = `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Structure the final result
    const result: AnalysisResult = {
      id: analysisId,
      items: analysisData.items || [],
      totals: analysisData.totals || {
        carbonFootprint: 0,
        waterUsage: 0,
        packagingWaste: 0,
        totalPrice: 0,
      },
      overallRating: analysisData.overallRating || 'C',
      timestamp: new Date().toISOString(),
    };

    console.log('Analysis complete:', analysisId);

    return NextResponse.json({
      success: true,
      id: analysisId,
      data: result,
      ocrText: extractedText.substring(0, 500), // Include preview for debugging
    });

  } catch (error) {
    console.error('Analysis error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to analyze receipt',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}