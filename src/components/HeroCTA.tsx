'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import BookingModal from './BookingModal'

export default function HeroCTA() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <motion.button
        initial={{ opacity: 0, y: 12, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.75 }}
        whileHover={{ y: -2 }}
        type="button"
        onClick={() => setOpen(true)}
        className="absolute z-[6] flex items-center border-none cursor-pointer"
        style={{
          bottom: 28,
          left: '50%',
          transform: 'translateX(-50%)',
          gap: 8,
          padding: '7px 7px 7px 20px',
          background: '#fff',
          color: '#0d0905',
          fontFamily: 'var(--font-hanken), system-ui, sans-serif',
          fontWeight: 600,
          fontSize: 13.5,
          letterSpacing: '-0.005em',
          borderRadius: 999,
          boxShadow: '0 10px 28px rgba(0,0,0,0.38)',
          whiteSpace: 'nowrap',
        }}
      >
        Agendar salto
        <span
          aria-hidden="true"
          className="inline-flex items-center justify-center rounded-full text-white flex-shrink-0"
          style={{
            width: 30,
            height: 30,
            background: '#2D6BFF',
            boxShadow: '0 3px 8px rgba(45,107,255,0.38)',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 3v15" />
            <polyline points="6 12 12 18 18 12" />
          </svg>
        </span>
      </motion.button>

      <BookingModal isOpen={open} onClose={() => setOpen(false)} />
    </>
  )
}
