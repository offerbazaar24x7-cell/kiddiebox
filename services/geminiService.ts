import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Product } from "../types";

// Initialize Gemini
// NOTE: In a real production app, ensure API_KEY is strictly server-side or proxied. 
// For this demo, we assume the environment variable is available.
const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

export const getAIRecommendations = async (
  query: string,
  availableProducts: Product[]
): Promise<{ message: string; recommendedIds: string[] }> => {
  if (!apiKey) {
    return {
      message: "I can help you find courses, but I need my API key first! (Simulated Mode)",
      recommendedIds: []
    };
  }

  try {
    const productContext = availableProducts
      .map(p => `ID: ${p.id}, Title: ${p.title}, Age: ${p.ageRange}, Category: ${p.category}, Desc: ${p.description}`)
      .join("\n");

    const prompt = `
      You are a helpful assistant for "KiddieBox.in", a course platform for kids ages 2-12.
      
      User Query: "${query}"

      Available Products:
      ${productContext}

      Task: 
      1. Analyze the user's query (child's age, interests).
      2. Recommend 1-3 most suitable products from the list.
      3. Write a friendly, encouraging message for the parent.
      
      Return JSON only.
    `;

    const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        message: { type: Type.STRING, description: "A friendly recommendation message for the parent." },
        recommendedIds: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING },
          description: "List of Product IDs that match the query."
        }
      },
      required: ["message", "recommendedIds"]
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        systemInstruction: "You are a warm, helpful educational consultant for parents."
      }
    });

    const result = JSON.parse(response.text || "{}");
    return {
      message: result.message || "I couldn't find a specific match, but feel free to browse our catalog!",
      recommendedIds: result.recommendedIds || []
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      message: "Oops! My brain is taking a nap. Please try searching manually.",
      recommendedIds: []
    };
  }
};