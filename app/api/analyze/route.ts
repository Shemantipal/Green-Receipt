import { NextResponse } from "next/server";
import PDFParser from "pdf2json";
import Tesseract from "tesseract.js-node";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

// ========= PDF TEXT EXTRACTOR (FAST, TEXT-BASED PDFs) ========= //
async function extractTextWithPdf2Json(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (err: any) => {
      const safeErr =
        (err as any)?.parserError ??
        err ??
        new Error("Unknown PDF parse error");
      reject(safeErr);
    });

    pdfParser.on("pdfParser_dataReady", () => {
      try {
        const text = pdfParser
          .getRawTextContent()
          .replace(/\s+/g, " ")
          .trim();

        resolve(text);
      } catch (e) {
        reject(e);
      }
    });

    pdfParser.parseBuffer(buffer);
  });
}

// ========= OCR (SCANNED PDFs, IMAGES) ========= //
async function extractUsingOCR(buffer: Buffer): Promise<string> {
  const tmpPath = path.join(process.cwd(), `tmp_ocr_${Date.now()}.png`);
  fs.writeFileSync(tmpPath, buffer);

  try {
    const result = await Tesseract.recognize(tmpPath, "eng", {
      logger: () => {}, // disable noisy logs
    });

    return result.data.text.trim();
  } finally {
    if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
  }
}

// ========= MAIN API ROUTE ========= //
export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const mime = file.type;

    let extractedText = "";

    console.log("FILE RECEIVED →", mime);

    // ====== CASE 1: PDF → Try text extraction first ======
    if (mime === "application/pdf") {
      console.log("→ Trying PDF text extraction (pdf2json)");

      try {
        extractedText = await extractTextWithPdf2Json(buffer);

        // Many PDFs return 0 text — detect that
        if (!extractedText || extractedText.length < 5) {
          console.log("→ PDF is likely image-based → Falling back to OCR");
          extractedText = await extractUsingOCR(buffer);
        }
      } catch (e) {
        console.log("pdf2json failed → OCR fallback", e);
        extractedText = await extractUsingOCR(buffer);
      }
    }

    // ====== CASE 2: Image Upload → OCR directly ======
    else {
      console.log("→ Non-PDF file, using OCR");
      extractedText = await extractUsingOCR(buffer);
    }

    return NextResponse.json({
  success: true,
  id: Date.now(),         // unique analysis ID
  data: { text: extractedText }
});


  } catch (err: any) {
    console.error("ANALYSIS FAILURE:", err);
    return NextResponse.json({ error: err?.message || "Unknown error" }, { status: 500 });
  }
}
