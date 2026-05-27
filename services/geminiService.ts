
import { GoogleGenAI, Type } from "@google/genai";
import { StrategyInput, GeneratedContent } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

// Helper to convert File to Base64
const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve({
        inlineData: {
          data: base64String,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Retry helper
const withRetry = async <T>(fn: () => Promise<T>, retries = 2): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      console.warn(`Retrying... attempts left: ${retries}`);
      return withRetry(fn, retries - 1);
    }
    throw error;
  }
};

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }
  return new GoogleGenAI({ apiKey });
};

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    results: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          platformName: { type: Type.STRING },
          hook: { type: Type.STRING },
          caption: { type: Type.STRING },
          overlayText: { type: Type.STRING },
          hashtags: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          engagementStrength: { 
            type: Type.STRING,
            description: "Estimated engagement: Low, Medium, or High"
          },
          engagementReason: { type: Type.STRING }
        },
        required: ["platformName", "hook", "caption", "hashtags", "engagementStrength", "engagementReason"]
      }
    }
  }
};

export const generateSocialStrategy = async (input: StrategyInput): Promise<GeneratedContent[]> => {
  const ai = getAIClient();

  if (!input.image) {
    throw new Error("No image provided.");
  }

  const imagePart = await fileToGenerativePart(input.image);

  const platformInstruction = `Generate content strictly for the following platforms: ${input.platform.join(', ')}.`;

  const userPrompt = `
    Analyze the attached image.
    
    Target Platforms: ${platformInstruction}
    Content Goal: ${input.goal}
    Brand Tone: ${input.tone}
    Hook Style: ${input.hookStyle}
    Industry/Context: ${input.industry || "General"}
    Exclusions: ${input.exclusions || "None"}
    
    Remember: Write in UK English. Be specific to the visual. Generate exactly one result per platform requested.
  `;

  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [imagePart, { text: userPrompt }]
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7,
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    try {
      const parsed = JSON.parse(text);
      return parsed.results || [];
    } catch (e) {
      console.error("Failed to parse JSON:", text);
      throw new Error("Failed to parse AI response.");
    }
  });
};

export const generateImagePrompt = async (image: File): Promise<string> => {
  const ai = getAIClient();
  const imagePart = await fileToGenerativePart(image);

  const prompt = `
    Act as a professional prompt engineer for AI image generators (like Midjourney, DALL-E 3, or Stable Diffusion).
    Analyze this image and recreate the exact type of prompt that would have been used to generate it.
    Include details about style, lighting, camera angle, composition, colors, and subject matter.
    Return ONLY the prompt text.
  `;

  return withRetry(async () => {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [imagePart, { text: prompt }]
      },
      config: {
        temperature: 0.4,
      }
    });

    return response.text || "Could not generate prompt.";
  });
};
