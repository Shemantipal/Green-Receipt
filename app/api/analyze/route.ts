import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    console.log("FILE RECEIVED →", file.type, file.name);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");

    let mimeType = file.type;
    if (!mimeType || mimeType === "application/octet-stream") {
      if (file.name.toLowerCase().endsWith(".pdf")) mimeType = "application/pdf";
      else if (file.name.match(/\.(jpg|jpeg)$/i)) mimeType = "image/jpeg";
      else if (file.name.endsWith(".png")) mimeType = "image/png";
      else if (file.name.endsWith(".webp")) mimeType = "image/webp";
    }

    console.log("→ Using Gemini Vision API with mime type:", mimeType);

    const prompt = `
You are an environmental impact analyzer. Analyze this receipt image and extract all items purchased.

Return ONLY a valid JSON object in this format:
{ ... }
`;


    const response = await genAI.models.generateContent({
      model: "gemini-3-pro-preview",  
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: { mimeType, data: base64 },
            },
            {
              text: prompt,
            },
          ],
        },
      ],
    });

    let text = response.text?.trim();

    if (!text) {
      return NextResponse.json(
        { error: "Empty response from AI", details: "No text generated" },
        { status: 500 }
      );
    }

    console.log("→ Gemini raw response:", text.substring(0, 200));

    text = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    let analysisData;

    try {
      analysisData = JSON.parse(text);
    } catch (err) {
      console.error("JSON Parse Error:", err, "Raw text:", text);
      return NextResponse.json(
        { error: "Failed to parse AI response", details: text },
        { status: 500 }
      );
    }

    if (analysisData.error) {
      return NextResponse.json({ error: analysisData.error }, { status: 400 });
    }

    if (!analysisData.items || analysisData.items.length === 0) {
      return NextResponse.json(
        { error: "No items found in receipt. Please upload a clearer image." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      id: Date.now(),
      data: analysisData,
    });
  } catch (err: any) {
    console.error("ANALYSIS FAILURE:", err);
    return NextResponse.json(
      {
        error: "Analysis failed",
        details: err?.message || "Unknown error",
      },
      { status: 500 }
    );
  }
}
