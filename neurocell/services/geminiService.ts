import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { ImageResolution } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates an image using the gemini-3-pro-image-preview model.
 */
export const generateImage = async (
  prompt: string,
  resolution: ImageResolution
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          { text: prompt },
        ],
      },
      config: {
        imageConfig: {
          imageSize: resolution,
          // count: 1 // Implicitly 1 usually, strict adherence to prompt examples
        },
      },
    });

    // Extract image from response parts
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          return `data:image/png;base64,${base64EncodeString}`;
        }
      }
    }
    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Image generation error:", error);
    throw error;
  }
};

/**
 * Creates a chat session and returns a helper to send messages.
 * Using gemini-3-pro-preview for complex reasoning and chat.
 */
export const createChatSession = () => {
  const chat = ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: "You are NeuroCell, an advanced AI interface bridging biological analysis and digital synthesis. Your tone is analytical yet poetic, often using metaphors related to biology, neural networks, and optics. Keep responses concise.",
    },
  });

  return {
    sendMessageStream: async (message: string) => {
      return chat.sendMessageStream({ message });
    }
  };
};
