import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const model = "gemini-1.5-flash";

// Create a customized task based on child past performance using Vertex AI / Gemini
export async function POST(request) {
    try {
        const { gradeId, subjectId, levelId, taskId, childId } = await request.json();

        if (!gradeId || !subjectId || !levelId || !taskId) {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
        }

        let pastPerformanceContext = "";

        // Fetch past task history for context if childId is provided
        if (childId) {
            // We limit to 3 but do not order by timestamp yet to avoid the missing composite index error
            const historySnap = await adminDb.collection(`childStats/${childId}/taskHistory`)
                .where('subjectId', '==', subjectId)
                .limit(3)
                .get();

            if (!historySnap.empty) {
                pastPerformanceContext = "Here is the student's recent performance on similar tasks:\\n";
                historySnap.docs.forEach(doc => {
                    const data = doc.data();
                    pastPerformanceContext += `- Score: ${data.score}. Interactions: ${JSON.stringify(data.history?.map(h => ({ q: h.question, correct: h.isCorrect })) || [])}\\n`;
                });
                pastPerformanceContext += "Use this to adjust the difficulty of the next questions.\\n";
            }
        }

        let researchContext = "";
        // Fetch Level details for research context
        const levelRefId = `${gradeId}_${subjectId}_${levelId}`;
        const levelDoc = await adminDb.collection('levels').doc(levelRefId).get();
        if (levelDoc.exists) {
            researchContext = levelDoc.data().researchContext || "";
        }

        const prompt = `You are an expert AI tutor creating a micro-task for a student in ${gradeId}.
The subject is ${subjectId}.
The task is part of level: ${levelId}, task: ${taskId}.

${researchContext ? `RESEARCH CONTEXT: ${researchContext}\nUse the above research-driven concepts to inform the question themes and vocabulary.` : ''}

${pastPerformanceContext}

Generate a short educational task with exactly 3 questions.
For each question, provide:
1. questionText: A fun, engaging question.
2. type: Either "multiple-choice" or "identification" (where they type the answer). Ensure a mix of both.
3. options: Array of exactly 4 strings if multiple-choice. Omit this if identification.
4. correctAnswer: The correct answer string.

        // Corrected standard SDK call for @google/genai
        const genModel = ai.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            generationConfig: {
                temperature: 0.7,
                responseMimeType: "application/json",
                responseSchema: {
                    type: "object",
                    properties: {
                        taskName: { type: "string" },
                        description: { type: "string" },
                        type: { type: "string" },
                        timeLimit: { type: "number" },
                        questions: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    questionText: { type: "string" },
                                    type: { type: "string" },
                                    options: {
                                        type: "array",
                                        items: { type: "string" }
                                    },
                                    correctAnswer: { type: "string" }
                                },
                                required: ["questionText", "type", "correctAnswer"]
                            }
                        }
                    },
                    required: ["taskName", "description", "type", "questions"]
                }
            }
        });

        const result = await genModel.generateContent(prompt);
        const generatedTask = JSON.parse(result.response.text());

        // Ensure we stamp it with the requested IDs
        generatedTask.taskId = taskId;
        generatedTask.isAiGenerated = true;

        return NextResponse.json(generatedTask);

    } catch (error) {
        console.error('Task Generation Error:', error);
        return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
    }
}
