import OpenAI from "openai";

const model = "grok-4.6";

export const POST = async (req) => {
    try {
        const grok = new OpenAI({
            apiKey: process.env.GROK_API_KEY || process.env.XAI_API_KEY,
            baseURL: "https://api.x.ai/v1",
        });

        const { content, actionType, gradeId, aiContext } = await req.json();

        let prompt = "";
        const personality = aiContext ? `Your personality for this task: ${aiContext}. ` : "";

        if (actionType === "simplify") {
            prompt = `${personality}The student is an elementary student in ${gradeId || 'school'}. They are trying to learn this concept: "${content}".
Rewrite this concept to be EXTREMELY simple, using shorter sentences, kid-friendly analogies, and very easy vocabulary. Respond with a short, highly encouraging message. Skip any greetings, just output the simpler explanation directly.`;
        } else if (actionType === "example") {
            prompt = `${personality}The student is in ${gradeId || 'school'}. They are learning: "${content}".
Give ONE super fun, real-world example of this concept that a kid would absolutely love (think pizza, toys, superheroes, or animals). ONLY give the example, make it exciting, and keep it under 3 sentences.`;
        } else if (actionType === "practice") {
            prompt = `${personality}The student is in ${gradeId || 'school'}. They just learned: "${content}".
Ask them ONE fun, simple interactive thinking question to test their understanding. Do not provide the answer. ONLY ask the question.`;
        } else {
            prompt = `${personality}Explain "${content}" to a kid in ${gradeId || 'elementary school'}.`;
        }

        const completion = await grok.chat.completions.create({
            model,
            messages: [
                {
                    role: "user",
                    content: prompt + "\n\nCRITICAL RULE: DO NOT use any markdown formatting, asterisks, or special characters like ** in your response. Keep it as pure plain text so it can be read out loud clearly by a voice synthesizer.",
                },
            ],
            max_tokens: 300,
            temperature: 0.3,
        });

        const responseText = completion.choices?.[0]?.message?.content || "";

        // Strip out any asterisks or hashtags that somehow slipped through
        const cleanText = responseText.replace(/[*#]/g, "");

        return new Response(JSON.stringify({ response: cleanText }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Tutor Error:", error);
        return new Response(
            JSON.stringify({ error: "Failed to generate tutor response." }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
};
