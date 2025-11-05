import {GoogleGenerativeAI} from '@google/generative-ai'
export const genAi=new GoogleGenerativeAI(`AIzaSyCWFKlAeOYopRefIkWFcKamEQPsW__3lk0`);
const model = genAi.getGenerativeModel({ model: "gemini-1.5-flash" });
export const askApi= async(prompt)=>{
    const result = await model.generateContent(prompt);
    return result.response.text();
}