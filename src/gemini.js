import { GoogleGenerativeAI } from '@google/generative-ai'

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const MODEL = import.meta.env.VITE_GEMINI_MODEL || 'gemini-1.5-flash'

export async function generateQuestions(topic, n = 10) {
  if (!API_KEY) throw new Error('VITE_GEMINI_API_KEY not set. Add it to .env for local demo.')
  const genai = new GoogleGenerativeAI(API_KEY)
  const model = genai.getGenerativeModel({ model: MODEL, generationConfig: { temperature: 0.4, topP: 0.9, topK: 32 } })

  const prompt = `You are a question writer for a quiz app.\n\nWrite EXACTLY ${n} multiple-choice questions for the topic: ${topic}.\n\nRules:\n- Each question has 4 options labeled a/b/c/d (include the letter in the string like \'a) ...\').\n- Provide a short explanation.\n- Return ONLY JSON array matching this schema: [ { \"q\":\"...\", \"options\":[\"a) ...\",\"b) ...\",\"c) ...\",\"d) ...\"], \"answer\":\"a|b|c|d\", \"explain\":\"...\" } ]`
  const result = await model.generateContent(prompt)
  let text = result.response?.text() || ''
  text = text.trim().replace(/^```(?:json)?/i, '').replace(/```$/,'').trim()

  let arr
  try { arr = JSON.parse(text) } catch {
    const s = text.indexOf('['), e = text.lastIndexOf(']')
    if (s >= 0 && e > s) { try { arr = JSON.parse(text.slice(s, e+1)) } catch {} }
  }
  if (!Array.isArray(arr)) throw new Error('Gemini did not return a JSON array. Raw: ' + text.slice(0, 300))

  const letters = ['a','b','c','d']
  const qs = arr.slice(0, n).map(q => {
    const opts = new Array(4).fill('').map((_,i)=>{
      const raw = (q.options && q.options[i]) ? String(q.options[i]) : ''
      return /^\s*[a-dA-D]\)\s/.test(raw) ? raw : `${letters[i]}) ${raw}`
    })
    let ans = String(q.answer||'a').trim().toLowerCase()
    if (!['a','b','c','d'].includes(ans)) ans='a'
    return { q: String(q.q||'').trim(), options: opts, answer: ans, explain: String(q.explain||'').trim() }
  })
  // Top-up from bank if short
  if (qs.length < n) {
    try {
      const extra = await bankFallback(topic, n - qs.length)
      qs.push(...extra)
    } catch {}
  }
  return qs
}

export async function bankFallback(topic, n) {
  const res = await fetch('/question_bank.json').catch(()=>null)
  if (!res || !res.ok) return []
  const bank = await res.json()
  const pool = bank.filter(q => normalize(topic) === normalize(q.topic))
  shuffle(pool)
  return pool.slice(0, n).map(q=>({
    q: String(q.q||''),
    options: (q.options||[]).slice(0,4),
    answer: String(q.answer||'a'),
    explain: String(q.explain||'')
  }))
}

function normalize(s){ return String(s||'').trim().toLowerCase() }
function shuffle(a){ for (let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]] } return a }
