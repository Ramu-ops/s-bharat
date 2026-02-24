import { GoogleGenAI, Type } from "@google/genai";
import { Skill, Gig, MatchingResult } from "./types";

export const getSkillMatches = async (userSkills: Skill[], gigs: Gig[]): Promise<MatchingResult[]> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return [];

  const ai = new GoogleGenAI({ apiKey });
  const model = ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Match these user skills with these gigs. User Skills: ${userSkills.map(s => s.title).join(", ")}. Gigs: ${JSON.stringify(gigs)}. Return a JSON array of objects with gigId, relevanceReason, and matchScore (0-100).`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            gigId: { type: Type.STRING },
            relevanceReason: { type: Type.STRING },
            matchScore: { type: Type.NUMBER }
          },
          required: ["gigId", "relevanceReason", "matchScore"]
        }
      }
    }
  });

  try {
    const response = await model;
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini matching failed", error);
    return [];
  }
};

export const chatWithAssistant = async (message: string): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return "API Key not configured.";

  const ai = new GoogleGenAI({ apiKey });
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: "You are 'SkillChain Sahayak', an AI assistant for SkillChain Bharat. Your goal is to help local gig workers in India understand how to use the app. Explain that SkillChain uses blockchain to verify skills, Aadhaar for KYC, and an escrow system for safe payments. Be helpful, concise, and use a friendly tone. You can answer in English or the user's local language if they ask.",
    },
  });

  try {
    const response = await chat.sendMessage({ message });
    return response.text || "I'm sorry, I couldn't process that.";
  } catch (error) {
    console.error("Gemini chat failed", error);
    return "Connection error. Please try again.";
  }
};
