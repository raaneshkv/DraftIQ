import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Sparkles, Brain, FileUp } from 'lucide-react'

export default function DocumentInput({ text, onChangeText, onAnalyze, domain, isAnalyzing, onSmartDetect }) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [showSmartDetect, setShowSmartDetect] = useState(false)
  const [placeholder, setPlaceholder] = useState('')
  const textareaRef = useRef(null)

  // Typewriter placeholder
  const fullPlaceholder = 'Paste your document here...'
  useEffect(() => {
    if (text) return
    let idx = 0
    let forward = true
    const interval = setInterval(() => {
      if (forward) {
        idx++
        setPlaceholder(fullPlaceholder.slice(0, idx))
        if (idx >= fullPlaceholder.length) {
          forward = false
          setTimeout(() => {}, 1500)
        }
      } else {
        idx--
        setPlaceholder(fullPlaceholder.slice(0, idx))
        if (idx <= 0) forward = true
      }
    }, 80)
    return () => clearInterval(interval)
  }, [text])

  // Intelligent Smart Detect (Runs ONLY when text changes)
  useEffect(() => {
    if (text.length < 50) {
      setShowSmartDetect(false)
      return
    }

    const txt = text.toLowerCase()
    let detected = null
    
    // Improved heuristics using regex for word boundaries to avoid false positives
    const isBusiness = /\b(q1|q2|q3|q4|roi|fiscal|revenue|stakeholders|ebitda)\b/.test(txt)
    const isResearch = /\b(methodology|et al|hypothesis|empirical|abstract)\b/.test(txt)
    const isTech = /\b(api|endpoint|architecture|const|function|database|latency)\b/.test(txt)
    const isEssay = /\b(therefore|society|argue|furthermore|essay)\b/.test(txt)

    if (isBusiness) detected = 'Business Report'
    else if (isTech) detected = 'Technical Report'
    else if (isResearch) detected = 'Research Paper'
    else if (isEssay) detected = 'Essay'

    if (detected) {
      setShowSmartDetect(true)
      if (onSmartDetect) {
        onSmartDetect(detected)
      }
    } else {
      setShowSmartDetect(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]) // ONLY depend on text, do not put domain in here, otherwise user override fails

  // Drag handlers
  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = e.dataTransfer.files
    if (files[0]) {
      const file = files[0]
      if (file.name.match(/\.(pdf|doc|docx)$/i)) {
        alert("Please drop raw .txt or .md files. Binary PDF/Word parsers are not enabled in this sandbox.")
        return
      }
      const reader = new FileReader()
      reader.onload = (ev) => onChangeText(ev.target.result)
      reader.readAsText(file)
    }
  }, [])

  return (
    <div className="space-y-4">
      {/* Textarea Container */}
      <div
        className={`relative rounded-2xl transition-all duration-300 ${
          isDragOver ? 'ring-2 ring-brand ring-offset-2 ring-offset-bg' : ''
        }`}
        onDragEnter={handleDrag}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <motion.div
        className="card-elegant overflow-hidden">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => onChangeText(e.target.value)}
            placeholder={placeholder}
            rows={12}
            className="w-full bg-transparent px-8 py-8 text-text-primary placeholder-text-muted focus:outline-none resize-none text-lg leading-relaxed"
            style={{ minHeight: 320 }}
          />

          {/* Bottom bar */}
          <div className="flex items-center justify-between px-6 py-3 border-t border-border/50">
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface cursor-pointer hover:bg-surface-lighter transition-colors text-sm text-text-secondary">
                <Upload className="w-3.5 h-3.5" />
                Upload file
                <input
                  type="file"
                  accept=".txt,.md"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      // Reject binaries
                      if (file.name.match(/\.(pdf|doc|docx)$/i)) {
                        alert("Please upload raw .txt or .md files. Binary PDF/Word parsers are not enabled in this sandbox.")
                        return
                      }
                      const reader = new FileReader()
                      reader.onload = (ev) => onChangeText(ev.target.result)
                      reader.readAsText(file)
                    }
                  }}
                />
              </label>

              <AnimatePresence>
                {showSmartDetect && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.8, x: -10 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold bg-accent/20 text-accent border border-accent/40 shadow-[0_0_10px_rgba(176,91,255,0.2)]"
                  >
                    <Brain className="w-4 h-4 animate-pulse" />
                    Smart Detected: {domain}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            <span className="text-xs text-text-muted tabular-nums">
              {text.length.toLocaleString()} chars
            </span>
          </div>
        </motion.div>

        {/* Drag overlay */}
        <AnimatePresence>
          {isDragOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 rounded-2xl flex items-center justify-center z-10 pointer-events-none"
              style={{
                background: 'rgba(10, 10, 15, 0.9)',
                border: '2px dashed rgba(167, 139, 250, 0.5)',
              }}
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="flex flex-col items-center gap-3"
              >
                <FileUp className="w-10 h-10 text-brand" />
                <span className="text-brand font-medium">Drop your document here</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Analyze Button */}
      <motion.button
        onClick={() => text.trim() && onAnalyze(text)}
        disabled={!text.trim() || isAnalyzing}
        whileHover={{ scale: text.trim() ? 1.02 : 1 }}
        whileTap={{ scale: text.trim() ? 0.98 : 1 }}
        className="w-full py-5 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold text-xl flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed border border-white/20 transition-all duration-300 shadow-[0_0_30px_rgba(139,92,246,0.5)] hover:shadow-[0_0_50px_rgba(139,92,246,0.8)]"
      >
        <Sparkles className="w-6 h-6" />
        Analyze with DraftIQ
      </motion.button>
    </div>
  )
}
