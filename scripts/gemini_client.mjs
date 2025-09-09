import { GoogleGenerativeAI } from '@google/generative-ai'

export function getKey(){ return process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY }
export function getModel(){ return process.env.GEMINI_MODEL || process.env.VITE_GEMINI_MODEL || 'gemini-1.5-flash' }

export function makeModel(){
  const key = getKey()
  if(!key) throw new Error('Set GEMINI_API_KEY (or VITE_GEMINI_API_KEY)')
  const genai = new GoogleGenerativeAI(key)
  return genai.getGenerativeModel({ model: getModel(), generationConfig: { temperature: 0.4, topP: 0.9, topK: 32 } })
}

export async function generateQuestions(topic, n=5){
  const model = makeModel()
  const prompt = `Write EXACTLY ${n} multiple-choice questions for topic ${topic}. 4 options labeled a/b/c/d (include letters). Include short explanation. Return ONLY JSON array with keys q, options[4], answer ('a'|'b'|'c'|'d'), explain.`
  const res = await model.generateContent(prompt)
  const text = (res.response?.text() || '').trim().replace(/^```(?:json)?/i,'').replace(/```$/,'').trim()
  return JSON.parse(text)
}
