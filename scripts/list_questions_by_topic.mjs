#!/usr/bin/env node
import { generateQuestions } from './gemini_client.mjs'
const topic = process.argv[2] || 'Python'
const n = parseInt(process.argv[3] || '5', 10)
try{
  const qs = await generateQuestions(topic, n)
  for(const q of qs){
    const [a,b,c,d] = q.options || []
    console.log(`Q: ${q.q}\n  ${a}\n  ${b}\n  ${c}\n  ${d}\n  Answer: ${q.answer} — ${q.explain}\n`)
  }
}catch(e){
  console.error('Error:', e.message)
  process.exit(1)
}
