# QuizMaster — React + Gemini (Pro Design, No Backend)

A polished, mobile-first React SPA using Google Gemini in the browser (demo-only).
It keeps a question-only quiz flow and adds a professional UI with clear states.

> ⚠️ Browser builds expose keys. For production, proxy requests or lock the key by HTTP referrer.

## Quick start
```bash
npm install
cp .env.example .env     # set VITE_GEMINI_API_KEY
npm run dev
```

## Test (Node + zsh)
```bash
export GEMINI_API_KEY=YOUR_KEY
./scripts/questions_ai.zsh "Python" 5
./scripts/list_questions_by_topic.zsh "Python" 5
```
