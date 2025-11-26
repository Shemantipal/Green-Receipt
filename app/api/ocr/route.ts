import { NextRequest, NextResponse } from "next/server";
import { PDFParser } from "pdf2json";
import Tesseract from "tesseract.js-node";

// ------------------------------- PDF PARSER -------------------------------

async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (err: any) => {
      const errorObj = err?.parserError ?? err;
      reject(errorObj);
    });

    pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
      try {
        const text = pdfData.Pages.map((page: any) =>
          page.Texts.map((t: any) =>
            decodeURIComponent(t.R[0].T)
          ).join(" ")
        ).join("\n");

        resolve(text || "");
      } catch (e) {
        reject(e);
      }
    });

    pdfParser.parseBuffer(buffer);
  });
}


// ------------------------------- OCR FALLBACK -------------------------------

async function extractTextFromImage(buffer: Buffer): Promise<string> {
  const { data } = await Tesseract.recognize(buffer, "eng", {
    logger: () => {},
  });

  return data.text || "";
}

// ------------------------------- ROUTE -------------------------------

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let text = "";

    if (file.type === "application/pdf") {
      try {
        text = await extractTextFromPDF(buffer);
      } catch (e) {
        console.error("PDF parsing failed → using OCR", e);
        text = await extractTextFromImage(buffer);
      }
    } else {
      text = await extractTextFromImage(buffer);
    }

    if (!text || text.trim().length < 5) {
      return NextResponse.json(
        { error: "Could not extract text from file." },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, text });

  } catch (err: any) {
    console.error("OCR Route Error:", err);
    return NextResponse.json(
      { error: "Server error", details: err.message },
      { status: 500 }
    );
  }
}
