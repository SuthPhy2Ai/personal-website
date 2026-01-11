import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment variables.");
  }
  return new GoogleGenAI({ apiKey });
};

export const editCrystalImage = async (
  base64Image: string,
  prompt: string
): Promise<string> => {
  const ai = getAiClient();
  const mimeType = "image/png"; // Assuming PNG input for simplicity, or detect from base64 header

  try {
    // Gemini 2.5 Flash Image supports image editing via text prompting.
    // We send the image + the text instruction.
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    // Iterate through parts to find the generated image
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return part.inlineData.data;
        }
      }
    }

    throw new Error("No image data returned from the model.");
  } catch (error) {
    console.error("Error editing crystal image:", error);
    throw error;
  }
};
