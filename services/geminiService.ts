import { GoogleGenAI, Modality } from "@google/genai";
import type { UploadedFile, AspectRatio } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = (file: UploadedFile) => {
  return {
    inlineData: {
      data: file.base64.split(',')[1],
      mimeType: file.file.type,
    },
  };
};

export const generateImage = async (
  design: UploadedFile,
  product: UploadedFile,
  logo: UploadedFile,
  aspectRatio: AspectRatio
): Promise<string> => {
  const model = 'gemini-2.5-flash-image';

  const prompt = `You are an expert photorealistic product image editor. Your task is to combine three images.

Image 1 is the 'Design Image'. Use its background, environment, lighting, and perspective for the final output.
Image 2 is the 'Product Image'. Isolate the product from this image, preserving its texture, folds, details, proportions, and color. Replace the product in the 'Design Image' with this product seamlessly. Ensure no trace of the original product from the Design Image remains.
Image 3 is the 'Logo Image'. Place this logo as a small, transparent watermark in the top-left corner of the final image. The logo must be outside the product itself.

The final image must be photorealistic, clean, and seamless, with an aspect ratio of ${aspectRatio}.`;

  const contents = {
    parts: [
      fileToGenerativePart(design),
      fileToGenerativePart(product),
      fileToGenerativePart(logo),
      { text: prompt },
    ],
  };

  const response = await ai.models.generateContent({
    model: model,
    contents: contents,
    config: {
      responseModalities: [Modality.IMAGE, Modality.TEXT],
    },
  });
  
  const imagePart = response.candidates?.[0]?.content?.parts.find(part => part.inlineData);

  if (imagePart && imagePart.inlineData) {
      const mimeType = imagePart.inlineData.mimeType;
      const base64Data = imagePart.inlineData.data;
      return `data:${mimeType};base64,${base64Data}`;
  }

  throw new Error('Image generation failed. No image data received.');
};

export const editImage = async (
    existingImage: string, // base64 string
    editPrompt: string
): Promise<string> => {
    const model = 'gemini-2.5-flash-image';
    const mimeType = existingImage.substring(existingImage.indexOf(':') + 1, existingImage.indexOf(';'));
    const base64Data = existingImage.split(',')[1];

    const prompt = `You are an expert photorealistic image editor. Take the provided image and apply the following instruction: "${editPrompt}". Return only the modified image.`;

    const contents = {
        parts: [
            {
                inlineData: {
                    data: base64Data,
                    mimeType: mimeType,
                },
            },
            { text: prompt },
        ],
    };

    const response = await ai.models.generateContent({
        model: model,
        contents: contents,
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });

    const imagePart = response.candidates?.[0]?.content?.parts.find(part => part.inlineData);

    if (imagePart && imagePart.inlineData) {
        const newMimeType = imagePart.inlineData.mimeType;
        const newBase64Data = imagePart.inlineData.data;
        return `data:${newMimeType};base64,${newBase64Data}`;
    }

    throw new Error('Image editing failed. No image data received.');
};
