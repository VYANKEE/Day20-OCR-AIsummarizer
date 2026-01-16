import Tesseract from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';

// 1. PDF Worker Fix (Vite Special)
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

// 2. Load API Key
const NVIDIA_API_KEY = import.meta.env.VITE_NVIDIA_API_KEY;

// --- OCR FUNCTIONS ---

export const extractTextFromImage = async (imageFile, language = 'eng', setProgress) => {
  return Tesseract.recognize(
    imageFile,
    language,
    {
      logger: m => {
        if (m.status === 'recognizing text') {
          setProgress(parseInt(m.progress * 100));
        }
      }
    }
  ).then(({ data: { text } }) => text);
};

export const extractTextFromPDF = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map(item => item.str).join(' ');
    fullText += `--- Page ${i} ---\n${pageText}\n\n`;
  }
  return fullText;
};

// --- NVIDIA AI SUMMARIZER (Llama 3.1) ---

export const summarizeText = async (text) => {
  if (!NVIDIA_API_KEY) throw new Error("API Key Missing in .env file");

  // Hum direct fetch use kar rahe hain taaki 'openai' lib ka browser error na aaye
 const response = await fetch("/api-nvidia/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${NVIDIA_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "meta/llama-3.1-8b-instruct",
      messages: [{ 
        role: "user", 
        content: `Summarize the following text in 3 concise bullet points:\n\n${text}` 
      }],
      temperature: 0.2,
      top_p: 0.7,
      max_tokens: 1024,
      stream: false 
    })
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.detail || "NVIDIA API Failed");
  }

  const data = await response.json();
  return data.choices[0].message.content;
};