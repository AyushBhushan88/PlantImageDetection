import { GoogleGenAI, Type } from '@google/genai';
import type { PlantData } from '../types';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  console.warn("API_KEY is not set. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const ayurVisionSchema = {
    type: Type.OBJECT,
    properties: {
        isPlant: { type: Type.BOOLEAN, description: "Is the image of a plant?" },
        identification: {
            type: Type.OBJECT,
            description: "The primary identification of the plant.",
            properties: {
                plantName: { type: Type.STRING },
                scientificName: { type: Type.STRING },
                alternativeNames: { type: Type.ARRAY, items: { type: Type.STRING } },
                confidence: { type: Type.NUMBER, description: "Confidence score from 0 to 100." },
                description: { type: Type.STRING, description: "A brief, engaging description of the plant and its significance in Ayurveda." },
                ayurvedicProperties: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of key Ayurvedic properties (e.g., Rasayana, Balya)." }
            },
            required: ["plantName", "scientificName", "alternativeNames", "confidence", "description", "ayurvedicProperties"]
        },
        alternativeMatches: {
            type: Type.ARRAY,
            description: "Up to 4 alternative plant identifications with confidence scores.",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    confidence: { type: Type.NUMBER }
                },
                required: ["name", "confidence"]
            }
        },
        detailedAnalysis: {
            type: Type.OBJECT,
            properties: {
                botanicalClassification: {
                    type: Type.OBJECT,
                    properties: {
                        family: { type: Type.STRING },
                        genus: { type: Type.STRING },
                        partsUsed: { type: Type.STRING },
                        habitat: { type: Type.STRING }
                    },
                    required: ["family", "genus", "partsUsed", "habitat"]
                },
                ayurvedicProfile: {
                    type: Type.OBJECT,
                    properties: {
                        rasa: { type: Type.STRING, description: "Tastes (e.g., Tikta, Kashaya)" },
                        virya: { type: Type.STRING, description: "Potency (e.g., Ushna, Sheeta)" },
                        vipaka: { type: Type.STRING, description: "Post-digestive effect (e.g., Madhura)" },
                        prabhava: { type: Type.STRING, description: "Special action" }
                    },
                    required: ["rasa", "virya", "vipaka", "prabhava"]
                },
                doshaEffects: {
                    type: Type.OBJECT,
                    properties: {
                        vata: { type: Type.STRING, description: "Effect on Vata dosha (e.g., Pacifies, Aggravates)" },
                        pitta: { type: Type.STRING, description: "Effect on Pitta dosha" },
                        kapha: { type: Type.STRING, description: "Effect on Kapha dosha" }
                    },
                    required: ["vata", "pitta", "kapha"]
                },
                traditionalUses: {
                    type: Type.OBJECT,
                    properties: {
                        primary: { type: Type.STRING },
                        secondary: { type: Type.STRING },
                        dosage: { type: Type.STRING, description: "Typical dosage form and amount." }
                    },
                    required: ["primary", "secondary", "dosage"]
                }
            },
            required: ["botanicalClassification", "ayurvedicProfile", "doshaEffects", "traditionalUses"]
        }
    },
    required: ["isPlant", "identification", "alternativeMatches", "detailedAnalysis"]
};


export async function identifyPlant(base64Image: string, mimeType: string): Promise<PlantData> {
  try {
    const prompt = `Analyze the provided image of a plant from an Ayurvedic perspective. Identify the primary medicinal plant, its scientific name, and a confidence score. Provide a list of alternative matches. Then, give a comprehensive analysis including its botanical classification, detailed Ayurvedic properties (Rasa, Virya, Vipaka, Prabhava), its effect on the three Doshas (Vata, Pitta, Kapha), and its traditional uses and dosage. If the image is not a plant, or cannot be identified, indicate that clearly by setting 'isPlant' to false.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          { text: prompt },
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: ayurVisionSchema,
      },
    });

    const jsonString = response.text?.trim();
    if (!jsonString) {
      throw new Error("The AI model returned an empty response. It may not have been able to identify the plant.");
    }
    
    let parsedData;
    try {
      parsedData = JSON.parse(jsonString);
    } catch (e) {
      console.error("Failed to parse JSON response from Gemini:", jsonString);
      throw new Error(`The AI model returned an unexpected response. Please try a different image.`);
    }
    
    return parsedData as PlantData;

  } catch (error) {
    console.error('Error calling Gemini API:', error);

    if (error instanceof Error) {
      // API Key issues
      if (error.message.includes('API_KEY') || error.message.toLowerCase().includes('api key not found')) {
        throw new Error('Configuration Error: The API key is missing or invalid. Please contact the site administrator.');
      }
      // Invalid argument / Bad Request (e.g., malformed image)
      if (error.message.includes('[400]')) {
        throw new Error('Invalid Image: The image could not be processed. Please try a different, high-quality image in JPG, PNG, or WEBP format.');
      }
      // Permission denied (e.g., API not enabled)
      if (error.message.includes('[403]')) {
          throw new Error('Access Denied: The API service is not enabled for this project. Please contact the site administrator.');
      }
      // Server-side errors
      if (error.message.includes('[500]') || error.message.includes('[503]')) {
        throw new Error('Service Unavailable: The AI identification service is temporarily down. Please try again in a few moments.');
      }
      // Network errors (client-side)
      if (error.name === 'TypeError' && error.message.toLowerCase().includes('failed to fetch')) {
        throw new Error('Network Error: Could not connect to the AI service. Please check your internet connection.');
      }
      // Re-throw specific errors from the inner try-catch blocks
      throw error;
    }
    
    // Generic fallback
    throw new Error('Failed to identify the plant due to an unexpected issue. Please try again.');
  }
}
