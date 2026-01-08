import { GoogleGenAI } from "@google/genai";
import { ImageSize } from "../types";

// Helper to check if API Key is selected (Required for High-End Models)
export const checkApiKeySelection = async (): Promise<boolean> => {
  const win = window as any;
  if (win.aistudio && typeof win.aistudio.hasSelectedApiKey === 'function') {
    return await win.aistudio.hasSelectedApiKey();
  }
  // Fallback for development environments without the wrapper
  return !!process.env.API_KEY;
};

export const promptForKeySelection = async (): Promise<void> => {
  const win = window as any;
  if (win.aistudio && typeof win.aistudio.openSelectKey === 'function') {
    await win.aistudio.openSelectKey();
  } else {
    console.warn("AI Studio key selection interface not available.");
  }
};

export const generateScientificImage = async (
  prompt: string,
  size: ImageSize
): Promise<string> => {
  // Create instance just before call to ensure fresh key usage
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          imageSize: size, // 1K, 2K, or 4K
          aspectRatio: "16:9", // Cinematic aspect ratio for visualizations
        },
      },
    });

    // Iterate to find image part
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          const base64EncodeString = part.inlineData.data;
          const mimeType = part.inlineData.mimeType || 'image/png';
          return `data:${mimeType};base64,${base64EncodeString}`;
        }
      }
    }
    
    throw new Error("No image data returned from the model.");
    
  } catch (error) {
    console.error("Image generation failed:", error);
    throw error;
  }
};