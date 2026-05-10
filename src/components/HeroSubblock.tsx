'use client'

import { motion } from 'framer-motion'

export default function HeroSubblock() {
  return (
    // Some completamente em mobile — não compete com a imersão
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.65 }}
      className="glass hidden sm:block absolute z-[4] rounded-2xl"
      style={{ left: 24, bottom: 84, maxWidth: 260, padding: '12px 16px 14px' }}
    >
      <h2
        className="text-white"
        style={{ fontWeight: 600, fontSize: 16, lineHeight: 1.22, letterSpacing: '-0.01em', marginBottom: 8 }}
      >
        Sua coragem<br />encontra o céu
      </h2>
      <div style={{ width: 22, height: 1, background: 'rgba(255,255,255,0.55)', marginBottom: 8 }} />
      <p
        className="hidden md:block"
        style={{ fontSize: 11.5, lineHeight: 1.5, color: 'rgba(255,255,255,0.70)' }}
      >
        Cada salto é desenhado em torno da sua segurança e da sua emoção.
      </p>
    </motion.div>
  )
}
