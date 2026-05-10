'use client'

import { motion } from 'framer-motion'

export default function HeroHeadlines() {
  return (
    <>
      {/* Left headline — upper */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.45 }}
        className="glass-lite absolute z-[4] rounded-[22px] pointer-events-none"
        style={{ top: '18%', left: 40, maxWidth: '50vw', padding: '18px 28px 22px' }}
      >
        <h1
          className="font-bold text-white"
          style={{
            fontSize: 'clamp(64px, 7.5vw, 132px)',
            lineHeight: 0.94,
            letterSpacing: '-0.028em',
          }}
        >
          <span className="block">VERTICAL</span>
          <span className="block">JUMP</span>
        </h1>
      </motion.div>

      {/* Right headline — lower */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.55 }}
        className="glass-lite absolute z-[4] rounded-[22px] pointer-events-none text-right"
        style={{ bottom: '22%', right: 40, maxWidth: '50vw', padding: '18px 28px 22px' }}
      >
        <h1
          className="font-bold text-white"
          style={{
            fontSize: 'clamp(64px, 7.5vw, 132px)',
            lineHeight: 0.94,
            letterSpacing: '-0.028em',
          }}
        >
          <span className="block">SINTA</span>
          <span className="block">O CÉU</span>
        </h1>
      </motion.div>
    </>
  )
}
