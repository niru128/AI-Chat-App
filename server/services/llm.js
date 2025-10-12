import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export const callLLM  = async ({messages})=>{
    try{
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages,
            temperature: 0.7,
            max_tokens: 800,
        });
        const content =  response.choices[0].message.content;
        const usage = response.usage || {};
        return  {content, usage};
    }
    catch(error){
        console.error("Error calling LLM", error);
        throw error;
    }
}