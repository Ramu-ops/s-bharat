
import { GoogleGenAI, Type } from "@google/genai";
import { Skill, Gig, MatchingResult } from "./types";

export const getSkillMatches = async (userSkills: Skill[], gigs: Gig[]): Promise<MatchingResult[]> => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY not configured for matching.");
    return [];
  }

  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
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

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Gemini matching failed", error);
    return [];
  }
};
