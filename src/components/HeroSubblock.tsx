'use client'

import { motion } from 'framer-motion'

export default function HeroSubblock() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.65 }}
      className="glass absolute z-[4] rounded-[18px]"
      style={{ left: 40, bottom: 104, maxWidth: 360, padding: '22px 24px 24px' }}
    >
      <h2
        className="text-white"
        style={{ fontWeight: 600, fontSize: 24, lineHeight: 1.18, letterSpacing: '-0.012em', marginBottom: 12 }}
      >
        Sua coragem<br />encontra o céu
      </h2>
      <div style={{ width: 32, height: 1, background: 'rgba(255,255,255,0.7)', marginBottom: 18 }} />
      <p style={{ fontSize: 13.5, lineHeight: 1.55, color: 'rgba(255,255,255,0.82)' }}>
        Cada salto é desenhado em torno da sua segurança e da sua emoção
        — você só precisa olhar para baixo e respirar fundo.
      </p>
    </motion.div>
  )
}
