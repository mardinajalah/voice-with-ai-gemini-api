// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const handler = async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }
  
  try {
    const result = await model.generateContent(prompt);
    const geminiResponse = result.response.text();
    res.json({ response: geminiResponse });
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ error: 'Something went wrong with Gemini API' });
  }
}

export default handler
