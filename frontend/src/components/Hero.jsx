import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ExternalLink, Github, ArrowRight, Activity, TrendingUp, Zap, Sparkles, Leaf, Shirt, Recycle, Droplets, Wind } from 'lucide-react'

const Hero = ({ onTrySolution }) => {
  const navigate = useNavigate()

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-20 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-black" />
      
      {/* Animated Gradient Orbs */}
      <motion.div
        className="absolute top-20 -left-40 w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(220,38,38,0.4) 0%, transparent 70%)' }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 -right-40 w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(239,68,68,0.3) 0%, transparent 70%)' }}
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.2, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, delay: 1 }}
      />

      {/* Geometric Pattern Overlay */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full">
          <defs>
            <pattern id="hexagons" x="0" y="0" width="100" height="87" patternUnits="userSpaceOnUse">
              <path d="M50 0 L93.3 25 L93.3 62 L50 87 L6.7 62 L6.7 25 Z" 
                    stroke="rgba(220,38,38,0.5)" 
                    fill="none" 
                    strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hexagons)" />
        </svg>
      </div>

      {/* Floating Circles */}
      <motion.div
        className="absolute top-1/4 left-20 w-3 h-3 rounded-full bg-red-600"
        animate={{ y: [0, -20, 0], opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute top-1/3 right-32 w-2 h-2 rounded-full bg-red-500"
        animate={{ y: [0, 20, 0], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
      />
      <motion.div
        className="absolute bottom-1/3 left-1/4 w-4 h-4 rounded-full bg-red-600/50"
        animate={{ y: [0, -15, 0], opacity: [0.2, 0.6, 0.2] }}
        transition={{ duration: 6, repeat: Infinity, delay: 2 }}
      />

      <div className="max-w-7xl mx-auto relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Logo Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-3 px-5 py-2.5 bg-zinc-900/50 border border-zinc-800 rounded-full backdrop-blur-sm"
            >
              <Leaf className="w-4 h-4 text-red-600" />
              <span className="text-white text-sm font-semibold tracking-wider">ECO-SCORE.AI</span>
            </motion.div>

            {/* Main Headline */}
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-6xl md:text-7xl lg:text-8xl font-bold leading-none"
              >
                <span className="block text-white mb-2">Sustainable</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-600 to-red-700">
                  Intelligence
                </span>
              </motion.h1>

              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl md:text-2xl text-zinc-400 leading-relaxed max-w-xl"
              >
                by understanding every product's environmental footprint, 
                we empower conscious decisions that shape a sustainable future
              </motion.p>
            </div>

            {/* Feature Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-3"
            >
              <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-full text-sm text-zinc-400">
                <Zap className="w-4 h-4 text-red-600" />
                Real-Time Analysis
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-full text-sm text-zinc-400">
                <Activity className="w-4 h-4 text-red-600" />
                AI-Powered
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-full text-sm text-zinc-400">
                <Leaf className="w-4 h-4 text-green-500" />
                Global Impact
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-wrap gap-4"
            >
              <button
                onClick={onTrySolution}
                className="group relative px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold transition-all duration-300 hover:scale-[1.02] overflow-hidden"
                style={{
                  boxShadow: '0 0 40px rgba(220, 38, 38, 0.4), 0 8px 16px rgba(0, 0, 0, 0.3)',
                }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Try Solution
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>

              <button
                onClick={() => navigate('/research-paper')}
                className="group px-8 py-4 bg-transparent border border-zinc-700 hover:border-zinc-600 text-white font-semibold transition-all duration-300 hover:bg-zinc-900/50 flex items-center gap-2"
                style={{
                  boxShadow: '0 0 20px rgba(255, 255, 255, 0.05), 0 4px 12px rgba(0, 0, 0, 0.2)',
                }}
              >
                Read Paper
                <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>

              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 text-zinc-500 hover:text-white font-semibold transition-all duration-300 flex items-center gap-2 hover:bg-zinc-900/30"
                style={{
                  boxShadow: '0 0 15px rgba(255, 255, 255, 0.03)',
                }}
              >
                <Github className="w-5 h-5" />
                GitHub
              </a>
            </motion.div>
          </motion.div>

          {/* Right: Eco-Friendly Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative hidden lg:block"
          >
            {/* Central Eco Circle */}
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Outer Rotating Ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-green-600/20"
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Middle Ring */}
              <motion.div
                className="absolute inset-0 m-8 rounded-full border border-red-600/20"
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              />

              {/* Center Glow */}
              <motion.div
                className="absolute inset-0 m-auto w-40 h-40 rounded-full bg-gradient-to-br from-green-600/20 to-red-600/20 blur-3xl"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                }}
              />

              {/* Eco Icons Orbiting */}
              {[
                { icon: Shirt, color: 'text-blue-500', delay: 0 },
                { icon: Recycle, color: 'text-green-500', delay: 0.5 },
                { icon: Droplets, color: 'text-cyan-500', delay: 1 },
                { icon: Wind, color: 'text-zinc-400', delay: 1.5 },
                { icon: Leaf, color: 'text-green-600', delay: 2 },
              ].map((item, i) => {
                const Icon = item.icon
                const angle = (i * 72 * Math.PI) / 180
                const radius = 180
                
                return (
                  <motion.div
                    key={i}
                    className="absolute"
                    style={{
                      top: '50%',
                      left: '50%',
                    }}
                    animate={{
                      x: [
                        Math.cos(angle) * radius,
                        Math.cos(angle + Math.PI * 2) * radius,
                      ],
                      y: [
                        Math.sin(angle) * radius,
                        Math.sin(angle + Math.PI * 2) * radius,
                      ],
                    }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear",
                      delay: item.delay,
                    }}
                  >
                    <motion.div
                      className={`w-12 h-12 rounded-full bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 flex items-center justify-center ${item.color}`}
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: item.delay,
                      }}
                    >
                      <Icon className="w-6 h-6" />
                    </motion.div>
                  </motion.div>
                )
              })}

              {/* Center Icon - T-shirt with Leaf */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="relative w-24 h-24 rounded-full bg-zinc-900/80 backdrop-blur-xl border-2 border-red-600/30 flex items-center justify-center"
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(220,38,38,0.3)',
                      '0 0 40px rgba(220,38,38,0.5)',
                      '0 0 20px rgba(220,38,38,0.3)',
                    ],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                >
                  <Shirt className="w-10 h-10 text-white" />
                  <motion.div
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-green-600 flex items-center justify-center"
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  >
                    <Leaf className="w-4 h-4 text-white" />
                  </motion.div>
                </motion.div>
              </div>

              {/* Connecting Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {[...Array(5)].map((_, i) => {
                  const angle = (i * 72 * Math.PI) / 180
                  const x = 50 + 35 * Math.cos(angle)
                  const y = 50 + 35 * Math.sin(angle)
                  
                  return (
                    <motion.line
                      key={i}
                      x1="50%"
                      y1="50%"
                      x2={`${x}%`}
                      y2={`${y}%`}
                      stroke="rgba(220,38,38,0.2)"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: [0, 1, 0] }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        delay: i * 0.3,
                      }}
                    />
                  )
                })}
              </svg>
            </div>

            {/* Floating Stats Cards */}
            <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="absolute top-10 -right-10 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-xl p-4 shadow-2xl"
          >
            <div className="text-xs text-zinc-500 mb-1">Predict carbon impact</div>
            <div className="text-2xl font-bold text-white">Accurately</div>
            <div className="text-xs text-green-500 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              AI-powered
            </div>
          </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
              className="absolute bottom-10 -left-10 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-xl p-4 shadow-2xl"
            >
              <div className="text-xs text-zinc-500 mb-1">Analyze any product</div>
              <div className="text-2xl font-bold text-white">In seconds</div>
              <div className="text-xs text-red-500 mt-1">From just a link</div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-20 mb-32 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* AI-Powered */}
          <div 
            className="bg-zinc-900/30 backdrop-blur-sm border border-zinc-800 p-6 hover:border-red-600/30 transition-all duration-300"
            style={{
              boxShadow: '0 0 30px rgba(220, 38, 38, 0.1), 0 8px 16px rgba(0, 0, 0, 0.2)',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <motion.div 
                  className="w-2 h-2 bg-red-600 rounded-full"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">AI-Powered</span>
              </div>
              <Activity className="w-4 h-4 text-red-600/50" />
            </div>
            
            <div className="text-zinc-500 text-sm mb-4">Advanced machine learning models</div>
            
            <div className="h-8 flex items-end gap-1">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="flex-1 bg-red-600/30"
                  animate={{
                    height: [`${20 + Math.random() * 80}%`, `${20 + Math.random() * 80}%`],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Real-Time */}
          <div 
            className="bg-zinc-900/30 backdrop-blur-sm border border-zinc-800 p-6 hover:border-red-600/30 transition-all duration-300"
            style={{
              boxShadow: '0 0 30px rgba(220, 38, 38, 0.1), 0 8px 16px rgba(0, 0, 0, 0.2)',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <motion.div 
                  className="w-2 h-2 bg-red-600 rounded-full"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                />
                <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Real-Time</span>
              </div>
              <TrendingUp className="w-4 h-4 text-red-600/50" />
            </div>
            
            <div className="text-zinc-500 text-sm mb-4">Instant analysis and predictions</div>
            
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-1 bg-zinc-800 overflow-hidden">
                  <motion.div
                    className="h-full bg-red-600"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.3,
                      ease: "linear",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Open Source */}
          <div 
            className="bg-zinc-900/30 backdrop-blur-sm border border-zinc-800 p-6 hover:border-red-600/30 transition-all duration-300"
            style={{
              boxShadow: '0 0 30px rgba(220, 38, 38, 0.1), 0 8px 16px rgba(0, 0, 0, 0.2)',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <motion.div 
                  className="w-2 h-2 bg-red-600 rounded-full"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                />
                <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wider">Open Source</span>
              </div>
              <Github className="w-4 h-4 text-red-600/50" />
            </div>
            
            <div className="text-zinc-500 text-sm mb-4">Community-driven development</div>
            
            <div className="flex gap-2">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-red-600/30 rounded-full"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border border-zinc-700 rounded-full flex justify-center p-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-2 bg-red-600 rounded-full"
          />
        </div>
      </motion.div>
    </section>
  )
}

export default Hero
