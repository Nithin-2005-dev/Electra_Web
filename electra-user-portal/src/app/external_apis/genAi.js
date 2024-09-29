import {GoogleGenerativeAI} from '@google/generative-ai'
export const genAi=new GoogleGenerativeAI('AIzaSyDIXTTI0hJq-WkXR-hVUariihUJO7frU_0');
const model = genAi.getGenerativeModel({ model: "gemini-1.5-flash" });
export const askApi= async(prompt)=>{
    const result = await model.generateContent(prompt);
    return result.response.text();
}