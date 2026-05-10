'use client'

import { motion } from 'framer-motion'

export default function HeroCTA() {
  return (
    <motion.button
      initial={{ opacity: 0, y: 14, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.75 }}
      whileHover={{ y: -2 }}
      type="button"
      className="absolute z-[6] flex items-center border-none cursor-pointer"
      style={{
        bottom: 46,
        left: '50%',
        transform: 'translateX(-50%)',
        gap: 10,
        padding: '8px 8px 8px 28px',
        background: '#fff',
        color: '#0d0905',
        fontFamily: 'var(--font-hanken), system-ui, sans-serif',
        fontWeight: 600,
        fontSize: 16,
        letterSpacing: '-0.005em',
        borderRadius: 999,
        boxShadow: '0 14px 38px rgba(0,0,0,0.45)',
        whiteSpace: 'nowrap',
      }}
    >
      Agendar salto
      <span
        aria-hidden="true"
        className="inline-flex items-center justify-center rounded-full text-white flex-shrink-0"
        style={{
          width: 38,
          height: 38,
          background: '#2D6BFF',
          boxShadow: '0 4px 10px rgba(45,107,255,0.45)',
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 3v15" />
          <polyline points="6 12 12 18 18 12" />
        </svg>
      </span>
    </motion.button>
  )
}
