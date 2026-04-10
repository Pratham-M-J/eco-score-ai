import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Loader2, AlertCircle, Search, ArrowRight,
  CheckCircle, XCircle, Globe, Droplet, Package, 
  Award, Leaf, TrendingUp, Activity, FileText
} from 'lucide-react'

// Markdown Renderer Component
const MarkdownRenderer = ({ content }) => {
  if (!content) return <p className="text-zinc-400">No report available</p>

  const parseMarkdown = (text) => {
    const lines = text.split('\n')
    const elements = []
    let currentList = []
    let listType = null

    const flushList = () => {
      if (currentList.length > 0) {
        elements.push({
          type: listType,
          items: [...currentList]
        })
        currentList = []
        listType = null
      }
    }

    lines.forEach((line, idx) => {
      // Headers
      if (line.startsWith('# ')) {
        flushList()
        elements.push({ type: 'h1', content: line.substring(2) })
      } else if (line.startsWith('## ')) {
        flushList()
        elements.push({ type: 'h2', content: line.substring(3) })
      } else if (line.startsWith('### ')) {
        flushList()
        elements.push({ type: 'h3', content: line.substring(4) })
      }
      // Unordered list
      else if (line.match(/^[\-\*]\s+/)) {
        if (listType !== 'ul') {
          flushList()
          listType = 'ul'
        }
        currentList.push(line.replace(/^[\-\*]\s+/, ''))
      }
      // Ordered list
      else if (line.match(/^\d+\.\s+/)) {
        if (listType !== 'ol') {
          flushList()
          listType = 'ol'
        }
        currentList.push(line.replace(/^\d+\.\s+/, ''))
      }
      // Paragraph
      else if (line.trim()) {
        flushList()
        elements.push({ type: 'p', content: line })
      }
      // Empty line
      else {
        flushList()
      }
    })

    flushList()
    return elements
  }

  const formatInlineMarkdown = (text) => {
    // Bold
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    // Italic
    text = text.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
    // Code
    text = text.replace(/`(.*?)`/g, '<code class="bg-zinc-900 px-2 py-1 rounded text-red-400 text-sm font-mono">$1</code>')
    return text
  }

  const elements = parseMarkdown(content)

  return (
    <div className="space-y-4">
      {elements.map((element, idx) => {
        switch (element.type) {
          case 'h1':
            return (
              <h1 key={idx} className="text-3xl font-bold text-white mb-4 mt-8 pb-3 border-b-2 border-red-600/30">
                {element.content}
              </h1>
            )
          case 'h2':
            return (
              <h2 key={idx} className="text-2xl font-bold text-white mb-3 mt-6 pb-2 border-b border-zinc-700">
                {element.content}
              </h2>
            )
          case 'h3':
            return (
              <h3 key={idx} className="text-xl font-semibold text-white mb-2 mt-4">
                {element.content}
              </h3>
            )
          case 'p':
            return (
              <p 
                key={idx} 
                className="text-zinc-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(element.content) }}
              />
            )
          case 'ul':
            return (
              <ul key={idx} className="space-y-2 ml-6">
                {element.items.map((item, itemIdx) => (
                  <li 
                    key={itemIdx} 
                    className="text-zinc-300 leading-relaxed list-disc"
                    dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(item) }}
                  />
                ))}
              </ul>
            )
          case 'ol':
            return (
              <ol key={idx} className="space-y-2 ml-6 list-decimal">
                {element.items.map((item, itemIdx) => (
                  <li 
                    key={itemIdx} 
                    className="text-zinc-300 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(item) }}
                  />
                ))}
              </ol>
            )
          default:
            return null
        }
      })}
    </div>
  )
}

const AppSection = () => {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)
  const [loadingStage, setLoadingStage] = useState('')

  const handleAnalyze = async () => {
    if (!url.trim()) {
      setError('Please enter a valid URL')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    const stages = [
      'Agent initializing...',
      'Scraping product data...',
      'Extracting features...',
      'Running ML models...',
      'Generating detailed report...'
    ]

    let stageIndex = 0
    const stageInterval = setInterval(() => {
      if (stageIndex < stages.length) {
        setLoadingStage(stages[stageIndex])
        stageIndex++
      }
    }, 1200)

    try {
      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url.trim() }),
      })

      clearInterval(stageInterval)

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.statusText}`)
      }

      const data = await response.json()
      setResult(data.data)
    } catch (err) {
      clearInterval(stageInterval)
      setError(err.message || 'Failed to analyze product. Please try again.')
    } finally {
      setLoading(false)
      setLoadingStage('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleAnalyze()
    }
  }

  // Parse prediction score from the result string
  const parseScore = (predictionString) => {
    if (!predictionString) return null
    const match = predictionString.match(/\[([\d.]+),\s*([\d.]+)\]/)
    if (match) {
      return {
        carbonEmission: parseFloat(match[1]), // First value: Carbon emission in kg
        ecoScore: parseFloat(match[2])        // Second value: Eco-friendliness score 0-100
      }
    }
    return null
  }

  const scores = result ? parseScore(result.prediction) : null
  
  // Get color based on eco-friendliness score (0-100, higher is better)
  const getScoreColor = (score) => {
    if (score >= 70) return { color: 'rgb(34, 197, 94)', name: 'green' }      // Green for good
    if (score >= 40) return { color: 'rgb(234, 179, 8)', name: 'yellow' }     // Yellow for medium
    return { color: 'rgb(239, 68, 68)', name: 'red' }                         // Red for poor
  }
  
  const scoreColor = scores ? getScoreColor(scores.ecoScore) : { color: 'rgb(220, 38, 38)', name: 'red' }

  return (
    <section className="min-h-screen px-6 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Try the <span className="text-red-600">Solution</span>
          </h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Paste any Flipkart product URL and get instant sustainability insights powered by AI
          </p>
        </motion.div>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <div className="glass glass-border rounded-2xl p-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Paste a Flipkart product URL here..."
                  disabled={loading}
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-12 py-4 text-white placeholder-zinc-500 focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <button
                onClick={handleAnalyze}
                disabled={loading || !url.trim()}
                className="group px-8 py-4 bg-red-600 hover:bg-red-700 disabled:bg-zinc-800 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(220,38,38,0.5)] disabled:hover:scale-100 disabled:hover:shadow-none flex items-center justify-center gap-2 min-w-[140px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Analyzing</span>
                  </>
                ) : (
                  <>
                    <span>Analyze</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-4xl mx-auto mb-12"
            >
              <div className="glass glass-border rounded-2xl p-12 text-center">
                <Loader2 className="w-16 h-16 text-red-600 animate-spin mx-auto mb-6" />
                <h3 className="text-2xl font-semibold mb-3">Processing Your Request</h3>
                <p className="text-zinc-400 text-lg">{loadingStage}</p>
                <div className="mt-8 flex justify-center gap-2">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 bg-red-600 rounded-full animate-pulse"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-4xl mx-auto mb-12"
            >
              <div className="glass glass-border border-red-600/30 rounded-2xl p-8 flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-red-500 mb-2">Analysis Failed</h3>
                  <p className="text-zinc-300">{error}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Dashboard */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="max-w-7xl mx-auto"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Card 1: Extracted Features */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="lg:col-span-2 glass glass-border rounded-2xl p-8 hover:border-red-600/30 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Package className="w-6 h-6 text-red-600" />
                    <h3 className="text-2xl font-bold">Extracted Features</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.extracted_features && Object.entries(result.extracted_features).map(([key, value]) => {
                      if (typeof value === 'boolean') {
                        return (
                          <div key={key} className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
                            <span className="text-zinc-300 capitalize text-sm">{key.replace(/_/g, ' ')}</span>
                            {value ? (
                              <span className="flex items-center gap-2 text-green-500 font-semibold text-sm">
                                <CheckCircle className="w-4 h-4" />
                                Yes
                              </span>
                            ) : (
                              <span className="flex items-center gap-2 text-zinc-600 font-semibold text-sm">
                                <XCircle className="w-4 h-4" />
                                No
                              </span>
                            )}
                          </div>
                        )
                      }
                      
                      return (
                        <div key={key} className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
                          <div className="text-zinc-400 text-xs mb-1 capitalize">{key.replace(/_/g, ' ')}</div>
                          <div className="text-white font-semibold">{value || 'N/A'}</div>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>

                {/* Card 2: Prediction Score */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass glass-border rounded-2xl p-6 hover:border-red-600/30 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Activity className="w-6 h-6 text-red-600" />
                    <h3 className="text-xl font-bold">Predictions</h3>
                  </div>
                  
                  {scores ? (
                    <div className="space-y-6">
                      {/* Eco-Friendliness Score with Dynamic Color */}
                      <div className="text-center">
                        <div className="relative w-44 h-44 mx-auto mb-4">
                          <svg className="w-full h-full transform -rotate-90">
                            {/* Background circle */}
                            <circle
                              cx="88"
                              cy="88"
                              r="75"
                              stroke="currentColor"
                              strokeWidth="12"
                              fill="none"
                              className="text-zinc-800"
                            />
                            {/* Progress circle with dynamic color */}
                            <circle
                              cx="88"
                              cy="88"
                              r="75"
                              stroke={scoreColor.color}
                              strokeWidth="12"
                              fill="none"
                              strokeDasharray={`${2 * Math.PI * 75}`}
                              strokeDashoffset={`${2 * Math.PI * 75 * (1 - scores.ecoScore / 100)}`}
                              className="transition-all duration-1000 ease-out"
                              strokeLinecap="round"
                              style={{ filter: `drop-shadow(0 0 8px ${scoreColor.color})` }}
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div>
                              <div className="text-4xl font-bold text-white mb-1">
                                {scores.ecoScore.toFixed(1)}
                              </div>
                              <div className="text-zinc-400 text-xs uppercase tracking-wider">Eco Score</div>
                            </div>
                          </div>
                        </div>
                        <div 
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
                          style={{ 
                            backgroundColor: `${scoreColor.color}20`,
                            color: scoreColor.color
                          }}
                        >
                          <div 
                            className="w-2 h-2 rounded-full animate-pulse"
                            style={{ backgroundColor: scoreColor.color }}
                          />
                          {scores.ecoScore >= 70 ? 'Excellent' : scores.ecoScore >= 40 ? 'Moderate' : 'Poor'}
                        </div>
                      </div>

                      {/* Carbon Emission */}
                      <div className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-zinc-400 text-sm">Carbon Emission</span>
                          <Droplet className="w-4 h-4 text-zinc-500" />
                        </div>
                        <div className="text-2xl font-bold text-white">
                          {scores.carbonEmission.toFixed(2)} <span className="text-lg text-zinc-500">kg CO₂</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-zinc-400 text-center py-8">
                      <p className="text-sm">{result.prediction || 'No prediction available'}</p>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Card 3: Detailed Report */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass glass-border rounded-2xl p-8 hover:border-red-600/30 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-6">
                  <FileText className="w-6 h-6 text-red-600" />
                  <h3 className="text-2xl font-bold">Detailed Sustainability Report</h3>
                </div>
                
                <div className="space-y-6">
                  {result.final_report && <MarkdownRenderer content={result.final_report} />}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

export default AppSection
