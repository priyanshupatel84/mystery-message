const { GoogleGenerativeAI } = require("@google/generative-ai");
import {NextApiRequest, NextApiResponse} from "next";

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GEN_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

export async function POST(req : NextApiRequest, res : NextApiResponse) {
    try {
        
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.setHeader('Surrogate-Control', 'no-store');

        const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment."; 
      
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log(text);

        return Response.json(
            {
              success: true,
              message: text,
            },
            {
              status: 200,
            }
          );
        
    } catch (error) {
        console.log("something went wrong while generating suggestion ", error)
        return Response.json(
            {
              success: false,
              message: "error fetching message",
            },
            {
              status: 500,
            }
          );
    }
  }
  

