'use client'

import { motion } from 'framer-motion'

export default function ScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.9 }}
      className="absolute z-[4]"
      style={{ right: 56, bottom: 56, width: 460, maxWidth: '42vw' }}
    >
      {/* Horizontal rule */}
      <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.28)', marginBottom: 18 }} />

      <div
        className="flex items-center justify-between"
        style={{ fontSize: 12, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700 }}
      >
        {/* Left: animated chevron + label */}
        <div className="flex items-center text-white" style={{ gap: 14 }}>
          <div className="relative overflow-hidden" style={{ width: 18, height: 18 }} aria-hidden="true">
            <svg
              className="block animate-bob"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
              <polyline points="6 15 12 21 18 15" opacity="0.55" />
            </svg>
          </div>
          <span>Role para saltar</span>
        </div>

        {/* Right: subtitle */}
        <span style={{ color: 'rgba(255,255,255,0.82)', letterSpacing: '0.18em' }}>
          para iniciar a queda
        </span>
      </div>
    </motion.div>
  )
}
