import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Header from './components/Header'
import Select from './routes/Select'
import Quiz from './routes/Quiz'
import Topics from './routes/Topics'

export default function App() {
  const navigate = useNavigate()
  const onQuit = () => {
    if (window.history && window.history.replaceState) {
      window.history.replaceState({}, document.title)
    }
    navigate('/select', { replace: true })
  }
  return (
    <div className="app">
      <div className="bg-grid"></div>
      <Header onQuit={onQuit} />
      <main className="container" aria-live="polite">
        <Routes>
          <Route path="/select" element={<Select />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/topics" element={<Topics />} />
          <Route path="/" element={<Navigate to="/select" replace />} />
          <Route path="*" element={<Navigate to="/select" replace />} />
        </Routes>
      </main>
      <footer className="footer">
        <span>© {new Date().getFullYear()} QuizMaster</span>
      </footer>
    </div>
  )
}
