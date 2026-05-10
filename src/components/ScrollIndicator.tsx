'use client'

import { motion } from 'framer-motion'

export default function ScrollIndicator() {
  return (
    // Some em mobile — o CTA já comunica a ação
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.9 }}
      className="hidden md:block absolute z-[4]"
      style={{ right: 28, bottom: 44, width: 320, maxWidth: '36vw' }}
    >
      <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.22)', marginBottom: 14 }} />
      <div
        className="flex items-center justify-between"
        style={{ fontSize: 10.5, letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700 }}
      >
        <div className="flex items-center text-white" style={{ gap: 10 }}>
          <div className="relative overflow-hidden" style={{ width: 16, height: 16 }} aria-hidden="true">
            <svg
              className="block animate-bob"
              width="12"
              height="12"
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
        <span style={{ color: 'rgba(255,255,255,0.65)', letterSpacing: '0.16em' }}>
          para iniciar a queda
        </span>
      </div>
    </motion.div>
  )
}
