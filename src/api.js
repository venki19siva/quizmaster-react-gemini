import { generateQuestions } from './gemini'
const LS_KEY = 'qm_topics_v2'

export async function getTopics() {
  const t = JSON.parse(localStorage.getItem(LS_KEY) || '[]')
  if (Array.isArray(t) && t.length) return { topics: t }
  const def = ['Python','Math','History','General Knowledge']
  localStorage.setItem(LS_KEY, JSON.stringify(def))
  return { topics: def }
}

export async function putTopics(topics) {
  const clean = Array.from(new Set((topics||[]).map(normalize).filter(Boolean)))
  localStorage.setItem(LS_KEY, JSON.stringify(clean))
  return { topics: clean }
}

export async function uploadTopics(file) {
  const text = await file.text()
  const lines = text.split(/\r?\n/).map(l => normalize(l.replace(/^\s*(?:\d+[\).\-:]\s*|[-•]\s*)?/, ''))).filter(Boolean)
  const merged = Array.from(new Set(lines))
  localStorage.setItem(LS_KEY, JSON.stringify(merged))
  return { ok: true, count: merged.length }
}

export async function getQuestions({ topic, n }) {
  const questions = await generateQuestions(topic, n)
  return { questions }
}

function normalize(s){ return String(s||'').replace('\ufeff','').trim() }
