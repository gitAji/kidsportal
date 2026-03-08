import { NextResponse } from 'next/server';
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const model = "gemini-1.5-flash";

export async function POST(request) {
    try {
        const { gradeId, subjectId } = await request.json();

        // Simulate research data from NotebookLM
        // In a production environment, this would call the NotebookLM MCP or API
        const researchContext = `
        Current educational research for ${subjectId} (${gradeId}):
        1. Increase focus on interactive tracing for younger students.
        2. Introduce concept of "Visual Grouping" in mathematics.
        3. Use more storytelling-based "Identification" tasks in English.
        4. Focus on environmental science topics like "Saving the Oceans" and "Recycling".
        `;

        const prompt = `You are an expert curriculum designer. 
        Given the following research and context for ${gradeId} ${subjectId}:
        ${researchContext}
        
        Generate 3 NEW and exciting educational "Levels" that could be added to the student's learning zone. 
        Each level should be distinct and follow a progressive difficulty.
        
        Format each level with:
        1. levelId: a string like "level-new-1"
        2. levelName: a fun, kid-friendly name
        3. description: clear learning objective
        4. difficulty: "Beginner", "Intermediate", or "Advanced"
        5. taskType: "quiz", "writing", or "video"
        6. taskCount: a number between 3 and 7
        7. researchContext: 1-2 sentences explaining why this level is recommended based on the research context provided above.
        
        Respond ONLY with valid JSON matching this schema:
        {
          "suggestedLevels": [
            {
              "levelId": "string",
              "levelName": "string",
              "description": "string",
              "difficulty": "string",
              "taskType": "string",
              "taskCount": number,
              "researchContext": "string"
            }
          ]
        }`;

        const generationConfig = {
            temperature: 0.8,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    suggestedLevels: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                levelId: { type: Type.STRING },
                                levelName: { type: Type.STRING },
                                description: { type: Type.STRING },
                                difficulty: { type: Type.STRING },
                                taskType: { type: Type.STRING },
                                taskCount: { type: Type.INTEGER },
                                researchContext: { type: Type.STRING, description: "Keywords/context from research to feed into AI generation" }
                            },
                            required: ["levelId", "levelName", "description", "difficulty", "taskType", "taskCount", "researchContext"]
                        }
                    }
                },
                required: ["suggestedLevels"]
            }
        };

        const genModel = ai.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: generationConfig
        });

        const result = await genModel.generateContent(prompt);
        const responseText = result.response.text();
        const syncResult = JSON.parse(responseText);

        return NextResponse.json(syncResult);

    } catch (error) {
        console.error('CRITICAL: Sync Research Error:', error);
        console.error('Error Details:', {
            message: error.message,
            stack: error.stack,
            cause: error.cause
        });
        return NextResponse.json({
            error: error.message,
            details: "Please check server logs for CRITICAL: Sync Research Error"
        }, { status: 500 });
    }
}
