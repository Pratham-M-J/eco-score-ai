import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Menu, X, Zap } from 'lucide-react'

const Navbar = ({ onHomeClick, onSolutionClick }) => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass glass-border border-b' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={onHomeClick}
            className="flex items-center gap-2 group"
          >
            <Zap className="w-6 h-6 text-[#E60000]" strokeWidth={2.5} />
            <span className="text-xl font-bold tracking-tight">
              Eco-Score<span className="text-[#E60000]">.AI</span>
            </span>
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={onHomeClick}
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Home
            </button>
            <button
              onClick={onSolutionClick}
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Solution
            </button>
            <a
              href="#"
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              API
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 pb-4 space-y-4"
          >
            <button
              onClick={() => {
                onHomeClick()
                setMobileMenuOpen(false)
              }}
              className="block w-full text-left text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => {
                onSolutionClick()
                setMobileMenuOpen(false)
              }}
              className="block w-full text-left text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Solution
            </button>
            <a
              href="#"
              className="block text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              API
            </a>
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}

export default Navbar
