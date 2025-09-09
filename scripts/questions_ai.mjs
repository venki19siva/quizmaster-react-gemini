#!/usr/bin/env node
import { generateQuestions } from './gemini_client.mjs'
const topic = process.argv[2] || 'Python'
const n = parseInt(process.argv[3] || '5', 10)
try{
  const qs = await generateQuestions(topic, n)
  console.log(JSON.stringify({ count: qs.length, sample: qs[0] }, null, 2))
}catch(e){
  console.error('Error:', e.message)
  process.exit(1)
}
