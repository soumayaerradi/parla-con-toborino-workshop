import "dotenv/config";

import {
  GoogleGenAI,
} from "@google/genai";


const apiKey =
  process.env
    .GEMINI_API_KEY;


if (!apiKey) {

  throw new Error(
    "GEMINI_API_KEY non trovata nel file .env"
  );
}


const model =
  process.env
    .GEMINI_WORKSHOP_MODEL ??
  "gemini-3.1-flash-lite";


const ai =
  new GoogleGenAI({
    apiKey,
  });


const response =
  await ai.models.generateContent({
    model,
    contents:
      "Rispondi con esattamente questo testo: Ciao Toborino!",
  });


console.log(
  response.text
);
