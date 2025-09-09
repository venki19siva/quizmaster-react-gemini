import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'

export default function Quiz() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const { topic, n, questions } = state || {}

  useEffect(() => {
    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      navigate('/select', { replace: true })
    }
  }, [questions, navigate])

  const total = questions?.length || 0
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState({})
  const [reveals, setReveals] = useState({})
  const [finished, setFinished] = useState(false)

  const q = questions?.[idx]

  const correctCount = useMemo(() =>
    Object.entries(reveals).reduce((acc, [, v]) => acc + (v?.correct ? 1 : 0), 0),
  [reveals])
  const score = correctCount * 10
  const progress = total ? Math.round(((idx + 1) / total) * 100) : 0

  const select = (letter) => {
    if (!q) return
    const isCorrect = (letter === q.answer)
    setAnswers((a) => ({ ...a, [idx]: letter }))
    setReveals((r) => ({ ...r, [idx]: { correct: isCorrect } }))
  }

  const next = () => setIdx((i) => Math.min(i + 1, total - 1))
  const prev = () => setIdx((i) => Math.max(i - 1, 0))
  const finish = () => setFinished(true)

  if (!q || !Array.isArray(q.options)) return null

  const chosen = answers[idx]
  const revealed = reveals[idx]

  return (
    <section className="panel" aria-labelledby="quiz-heading">
      <div className="quiz-header">
        <div>
          <h1 id="quiz-heading">{topic || 'Quiz'}</h1>
          <div className="muted">Question {idx+1} of {total}</div>
        </div>
        <div className="score-chip" title="10 points per correct">{score} pts</div>
      </div>

      <div className="progress" aria-label={`Progress ${progress}%`}>
        <div className="bar" style={{ width: `${progress}%` }} />
      </div>

      {!finished ? (
        <div className="question-block fade-in">
          <div className="qtext" dangerouslySetInnerHTML={{ __html: q.q }} />

          <div className="options" role="group" aria-label="Answer options">
            {q.options.map((opt, i) => {
              const letter = ['a','b','c','d'][i]
              const clean = String(opt).replace(/^\s*[a-dA-D]\)\s*/, '')
              const isChosen = chosen === letter
              const isCorrect = q.answer === letter
              const showCorrect = revealed && isCorrect
              const showWrong = revealed && isChosen && !isCorrect
              return (
                <button
                  key={letter}
                  className={'option ' + (showCorrect ? 'correct ' : '') + (showWrong ? 'wrong ' : '')}
                  onClick={() => select(letter)}
                  aria-pressed={isChosen}
                >
                  <span className="opt-label">{letter})</span>
                  <span>{clean}</span>
                </button>
              )
            })}
          </div>

          <div className="feedback" role="status" aria-live="polite">
            {revealed && (revealed.correct ? (
              <div className="ok">✅ Correct! Answer: {q.answer}</div>
            ) : (
              <div className="bad">❌ Incorrect. Correct answer: {q.answer}{q.explain ? <div className="explain">{q.explain}</div> : null}</div>
            ))}
          </div>

          <div className="nav">
            <button className="btn" onClick={prev} disabled={idx===0}>Prev</button>
            {idx < total - 1 ? (
              <button className="btn" onClick={next}>Next</button>
            ) : (
              <button className="btn primary" onClick={finish}>Finish</button>
            )}
          </div>
        </div>
      ) : (
        <Summary total={total} correct={correctCount} score={score} />
      )}
    </section>
  )
}

function Summary({ total, correct, score }) {
  const wrong = total - correct
  return (
    <div className="summary pop" role="dialog" aria-modal="false" aria-labelledby="sum-h">
      <h2 id="sum-h">Quiz Summary</h2>
      <ul>
        <li><strong>Score:</strong> {score}</li>
        <li><strong>Correct:</strong> {correct}</li>
        <li><strong>Incorrect:</strong> {wrong}</li>
        <li><strong>Total:</strong> {total}</li>
      </ul>
      <p className="muted">Use Quit to start another quiz.</p>
    </div>
  )
}
