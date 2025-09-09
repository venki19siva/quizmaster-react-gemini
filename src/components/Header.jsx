import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useRef, useState } from 'react'
import { uploadTopics } from '../api'

function Logo() {
  return (
    <div className="logo" aria-hidden="true">
      <span className="dot dot-a"></span>
      <span className="dot dot-b"></span>
      <span className="dot dot-c"></span>
    </div>
  )
}

export default function Header({ onQuit }) {
  const fileRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const handlePick = () => fileRef.current?.click()
  const onFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setBusy(true); setError('')
    try {
      await uploadTopics(file)
      navigate('/select', { replace: true })
      setOpen(false)
    } catch (err) {
      setError(err?.message || 'Upload failed')
    } finally {
      setBusy(false)
      e.target.value = ''
    }
  }

  return (
    <header className="header" role="banner">
      <button
        className="menu-toggle"
        aria-label="Toggle navigation"
        aria-controls="primary-nav"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >☰</button>

      <div className="brand">
        <Logo />
        <span className="brand-name">QuizMaster</span>
      </div>

      <nav id="primary-nav" className="header-nav" aria-label="Primary" data-open={open ? 'true' : 'false'} onClick={() => setOpen(false)}>
        <Link to="/select" className={location.pathname==='/select' ? 'active' : ''}>Select Topic</Link>
        <Link to="/topics" className={location.pathname==='/topics' ? 'active' : ''}>Update Topics</Link>
        <button className="linklike" onClick={handlePick} disabled={busy} aria-busy={busy}>
          {busy ? 'Uploading…' : 'Upload Topics'}
        </button>
        <input ref={fileRef} type="file" accept=".txt,text/plain" onChange={onFileChange} style={{display:'none'}} aria-hidden="true" />
      </nav>

      <div className="header-right">
        <button className="btn-quit" onClick={onQuit}>Quit</button>
      </div>
      {error && <div className="callout error" role="alert">{error}</div>}
    </header>
  )
}
