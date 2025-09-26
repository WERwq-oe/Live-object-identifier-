
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const PROMPT = `Identify the main subject in this image with high accuracy. Provide only the name of the object. For example: "Laptop", "Coffee Mug", "Dog". If multiple objects are prominent, name the most central one. If you cannot identify a specific object, respond with "Object not clear". Do not add any descriptive text or markdown.`;

export async function identifyImage(base64ImageData: string): Promise<string> {
  try {
    const imagePart = {
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64ImageData,
      },
    };

    const textPart = {
      text: PROMPT,
    };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
       config: {
         // Disable thinking for faster, more reactive responses suitable for near real-time identification.
         thinkingConfig: { thinkingBudget: 0 }
       }
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error identifying image:", error);
    if (error instanceof Error) {
        return `API Error: ${error.message}`;
    }
    return "An unknown API error occurred.";
  }
}
