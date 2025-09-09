import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTopics, getQuestions } from '../api'

const COUNTS = [5, 10, 15, 20]

export default function Select() {
  const [topics, setTopics] = useState([])
  const [topic, setTopic] = useState('')
  const [n, setN] = useState(10)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [fetching, setFetching] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true); setError('')
    getTopics()
      .then((data) => {
        const t = Array.isArray(data?.topics) ? data.topics : []
        setTopics(t)
        setTopic((prev) => prev || t[0] || '')
      })
      .catch((err) => setError(String(err?.message || err)))
      .finally(() => setLoading(false))
  }, [])

  const hasTopics = topics.length > 0

  const onGet = async () => {
    if (!topic) return
    setFetching(true); setError('')
    try {
      const { questions } = await getQuestions({ topic, n })
      if (!Array.isArray(questions) || questions.length === 0) {
        setError('No questions returned by Gemini')
        return
      }
      navigate('/quiz', { state: { topic, n, questions } })
    } catch (err) {
      setError(String(err?.message || err))
    } finally {
      setFetching(false)
    }
  }

  return (
    <section aria-labelledby="select-heading" className="panel">
      <div className="hero">
        <div className="hero-left">
          <h1 id="select-heading">Sharpen your skills</h1>
          <p className="muted">Pick a topic, choose how many questions, and start a focused quiz. Immediate feedback with clear explanations.</p>
        </div>
        <div className="hero-right">
          <div className="badge">AI-Powered</div>
        </div>
      </div>

      {error && <div className="callout error" role="alert">{error}</div>}

      {loading ? (
        <div className="skeleton-grid">
          <div className="skeleton-card"></div>
          <div className="skeleton-card"></div>
        </div>
      ) : (
        <div className="cards">
          <div className="card">
            <div className="card-header">1. Choose topic</div>
            {!hasTopics ? (
              <div className="empty">
                <div>No topics found.</div>
                <div className="mt-2">Use <strong>Update Topics</strong> to add items or <strong>Upload Topics</strong> in the header.</div>
              </div>
            ) : (
              <label className="block">
                <span className="label">Topic</span>
                <select value={topic} onChange={(e) => setTopic(e.target.value)} disabled={!hasTopics}>
                  {topics.map((t) => (<option key={t} value={t}>{t}</option>))}
                </select>
              </label>
            )}
          </div>

          <div className="card">
            <div className="card-header">2. How many questions?</div>
            <label className="block">
              <span className="label">Count</span>
              <select value={n} onChange={(e) => setN(Number(e.target.value))}>
                {COUNTS.map((c) => (<option key={c} value={c}>{c}</option>))}
              </select>
            </label>
            <div className="actions">
              <button className="btn primary" onClick={onGet} disabled={!hasTopics || fetching}>
                {fetching ? 'Preparing…' : 'Get Questions'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
