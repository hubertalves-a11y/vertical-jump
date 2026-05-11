'use client'

import { motion } from 'framer-motion'

export default function HeroSubblock() {
  return (
    // Completamente oculto em mobile — não compete com a imagem
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.65 }}
      className="glass hidden md:block absolute z-[4] rounded-2xl"
      style={{ left: 24, bottom: 80, maxWidth: 240, padding: '11px 15px 13px' }}
    >
      <h2
        className="text-white"
        style={{ fontWeight: 600, fontSize: 15, lineHeight: 1.22, letterSpacing: '-0.01em', marginBottom: 7 }}
      >
        Sua coragem<br />encontra o céu
      </h2>
      <div style={{ width: 20, height: 1, background: 'rgba(255,255,255,0.45)', marginBottom: 7 }} />
      <p style={{ fontSize: 11, lineHeight: 1.5, color: 'rgba(255,255,255,0.62)' }}>
        Cada salto é desenhado em torno da sua segurança e da sua emoção.
      </p>
    </motion.div>
  )
}
