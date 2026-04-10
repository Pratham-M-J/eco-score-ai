import React, { useRef } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import Hero from './components/Hero'
import AppSection from './components/AppSection'
import ResearchPaper from './components/ResearchPaper'

function HomePage() {
  const appSectionRef = useRef(null)

  const scrollToApp = () => {
    appSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-600/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Hero onTrySolution={scrollToApp} />
        <div ref={appSectionRef}>
          <AppSection />
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/research-paper" element={<ResearchPaper />} />
      </Routes>
    </Router>
  )
}

export default App
