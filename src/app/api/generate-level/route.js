import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { GoogleGenAI } from "@google/genai";
import dbData from '@/app/data/db.json';
import { safeErrorResponse } from '@/lib/apiError';

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const subjectDisplayNames = {
    english: 'English',
    math: 'Math',
    science: 'Science',
    tamil: 'Tamil',
    computerscience: 'Computer Science',
    coding: 'Coding',
};

function getSubjectDisplayName(subjectId) {
    const prefix = (subjectId || '').replace(/-\d+$/, '').toLowerCase();
    return subjectDisplayNames[prefix] || prefix;
}

// Existing levels for this grade+subject, Firestore first (includes any
// previously AI-generated bonus levels) with a local db.json fallback —
// mirrors the read pattern already used by the subject/level pages.
async function getExistingLevels(gradeId, subjectId) {
    const snap = await adminDb.collection('levels').where('subjectId', '==', subjectId).get();
    const fromFirestore = snap.docs
        .map(doc => doc.data())
        .filter(l => l.gradeId === gradeId);

    if (fromFirestore.length > 0) {
        return fromFirestore.sort((a, b) => {
            const aNum = parseInt(a.levelId.split('-').pop(), 10) || 0;
            const bNum = parseInt(b.levelId.split('-').pop(), 10) || 0;
            return aNum - bNum;
        });
    }

    const gradeData = dbData.grades.find(g => g.gradeId === gradeId);
    const subject = gradeData?.subjects?.find(s => s.subjectId === subjectId);
    return subject?.levels || [];
}

// Generate a brand-new curriculum level (lesson + quiz + exam) once a
// student has finished every existing level in a subject, so there's
// always somewhere further to go instead of a dead end.
export async function POST(request) {
    try {
        const { gradeId, subjectId } = await request.json();

        if (!gradeId || !subjectId) {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
        }

        const existingLevels = await getExistingLevels(gradeId, subjectId);
        const nextLevelNumber = existingLevels.length + 1;
        const levelId = `${subjectId}-level-${nextLevelNumber}`;
        const coveredTopics = existingLevels.map(l => l.levelName).filter(Boolean);
        const lastModule = existingLevels[existingLevels.length - 1]?.moduleName || null;
        const gradeNumber = parseInt(gradeId.replace(/\D/g, ''), 10) || '';
        const subjectName = getSubjectDisplayName(subjectId);
        const isTamil = subjectId.toLowerCase().includes('tamil');

        const prompt = `You are an expert curriculum designer creating the NEXT level for a ${subjectName} course for Grade ${gradeNumber} students (age-appropriate for that grade).

This student has already completed every existing level in this subject, so this is bonus/extension content that continues their learning journey. It must be a NEW topic, appropriately harder or a natural next step after what they've already covered.

Topics already covered (do NOT repeat these): ${coveredTopics.length ? coveredTopics.join(', ') : 'none yet'}.
${lastModule ? `The most recent module was "${lastModule}" — you may continue it or start a fitting new module.` : ''}
${isTamil ? 'Write the lesson and questions in the same bilingual style as the rest of this course: primarily Tamil script for the language content and terms, with short English glosses in parentheses where helpful, exactly like a Tamil-language lesson for this grade would already read.' : ''}

Generate exactly one new level with:
- levelName: a short, specific topic title (e.g. "Fractions of Shapes")
- moduleName: a module grouping label (e.g. "Module 5: ...") — reuse the current module name if this topic still fits it, otherwise name the next module
- badgeEmoji: one single emoji that fits the topic
- lessonContent: 2-4 sentences teaching the concept clearly, with at least one worked example, matching the tone of a friendly children's course
- quizQuestions: exactly 4 questions practicing the concept, each with a questionText, a type of either "multiple-choice" (with exactly 4 options) or "identification" (typed answer, no options), and the correctAnswer
- examQuestions: exactly 5 questions that are somewhat harder than the quiz, same type/options/correctAnswer shape

Keep a healthy mix of "multiple-choice" and "identification" question types across the quiz and exam.`;

        const genModel = ai.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: {
                temperature: 0.8,
                responseMimeType: "application/json",
                responseSchema: {
                    type: "object",
                    properties: {
                        levelName: { type: "string" },
                        moduleName: { type: "string" },
                        badgeEmoji: { type: "string" },
                        lessonContent: { type: "string" },
                        quizQuestions: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    questionText: { type: "string" },
                                    type: { type: "string" },
                                    options: { type: "array", items: { type: "string" } },
                                    correctAnswer: { type: "string" }
                                },
                                required: ["questionText", "type", "correctAnswer"]
                            }
                        },
                        examQuestions: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    questionText: { type: "string" },
                                    type: { type: "string" },
                                    options: { type: "array", items: { type: "string" } },
                                    correctAnswer: { type: "string" }
                                },
                                required: ["questionText", "type", "correctAnswer"]
                            }
                        }
                    },
                    required: ["levelName", "moduleName", "lessonContent", "quizQuestions", "examQuestions"]
                }
            }
        });

        const result = await genModel.generateContent(prompt);
        const generated = JSON.parse(result.response.text());

        const newLevel = {
            levelId,
            gradeId,
            subjectId,
            levelName: generated.levelName,
            moduleName: generated.moduleName,
            badgeEmoji: generated.badgeEmoji || '⭐',
            isLocked: false,
            isAiGenerated: true,
            tasks: [
                {
                    taskId: `${levelId}-lesson`,
                    taskName: `Lesson: ${generated.levelName}`,
                    type: 'lesson',
                    content: generated.lessonContent,
                    questions: [],
                },
                {
                    taskId: `${levelId}-quiz`,
                    taskName: 'Practice Quiz',
                    type: 'quiz',
                    timeLimit: 180,
                    content: "Let's practice what we just learned!",
                    questions: (generated.quizQuestions || []).map((q, i) => ({
                        questionId: `${levelId}-quiz-q${i + 1}`,
                        questionText: q.questionText,
                        correctAnswer: q.correctAnswer,
                        type: q.type,
                        ...(q.type === 'multiple-choice' ? { options: q.options } : {}),
                    })),
                },
                {
                    taskId: `${levelId}-exam`,
                    taskName: 'Level Challenge!',
                    type: 'exam',
                    timeLimit: 300,
                    content: 'Time to show what you know!',
                    questions: (generated.examQuestions || []).map((q, i) => ({
                        questionId: `${levelId}-exam-q${i + 1}`,
                        questionText: q.questionText,
                        correctAnswer: q.correctAnswer,
                        type: q.type,
                        ...(q.type === 'multiple-choice' ? { options: q.options } : {}),
                    })),
                },
            ],
        };

        await adminDb.collection('levels').doc(`${gradeId}_${subjectId}_${levelId}`).set(newLevel);

        return NextResponse.json(newLevel);
    } catch (error) {
        return safeErrorResponse('Level Generation Error:', error, 'Failed to generate level.');
    }
}
