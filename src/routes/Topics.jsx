import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTopics, putTopics } from '../api'

export default function Topics() {
  const [raw, setRaw] = useState('')
  const [newTopic, setNewTopic] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true); setError('')
    getTopics()
      .then(({ topics }) => setRaw((topics || []).join('\n')))
      .catch((e) => setError(String(e?.message || e)))
      .finally(() => setLoading(false))
  }, [])

  const list = useMemo(() => dedupe(splitLines(raw)), [raw])

  const add = () => {
    const t = normalize(newTopic)
    if (!t) return
    const merged = dedupe([...list, t])
    setRaw(merged.join('\n'))
    setNewTopic('')
  }

  const save = async () => {
    setSaving(true); setError('')
    try {
      await putTopics(list)
      navigate('/select')
    } catch (e) {
      setError(String(e?.message || e))
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="panel">
      <h1>Update Topics</h1>

      {loading && <div className="muted">Loading…</div>}
      {error && <div className="callout error" role="alert">{error}</div>}

      <div className="card">
        <div className="card-header">Add a topic</div>
        <div className="add-row">
          <input type="text" value={newTopic} onChange={(e) => setNewTopic(e.target.value)} placeholder="Add a topic" aria-label="New topic" />
          <button className="btn" onClick={add}>Add</button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">Edit list (one per line)</div>
        <label className="block">
          <span className="label">Topics</span>
          <textarea value={raw} onChange={(e) => setRaw(e.target.value)} rows={16} spellCheck={false} aria-label="Topics editor" />
        </label>

        <div className="actions">
          <button className="btn" onClick={() => navigate('/select')}>Cancel</button>
          <button className="btn primary" onClick={save} disabled={saving} aria-busy={saving}>{saving ? 'Saving…' : 'Save'}</button>
        </div>
      </div>
    </section>
  )
}

function splitLines(s){return String(s).split(/\r?\n/).map(normalize).filter(Boolean)}
function dedupe(arr){return Array.from(new Set(arr))}
function normalize(s){return String(s).replace(/^\s*(?:\d+[\).\-:]\s*|[\-•]\s*)?/, '').trim()}
