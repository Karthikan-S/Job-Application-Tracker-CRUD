import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';
import LandingPage from './pages/LandingPage.tsx'

<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"></link>
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LandingPage />
  </StrictMode>,
)
