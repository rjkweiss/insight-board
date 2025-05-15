import OpenAI from 'openai';

const openai= new OpenAI({
    apiKey: process.env.OPENAI_KEY
});

export const summarizeText = async (text: string) => {
    const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        store: true,
        messages: [{ role: 'user', content: `Summarize this task: ${text}` }],
    });
    return completion.choices[0]?.message?.content || '';
};
