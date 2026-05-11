'use client'

import { motion } from 'framer-motion'

const navLinks = [
  { label: 'A Vertical', href: '#' },
  { label: 'Modalidades', href: '#' },
  { label: 'Curso AFF', href: '#' },
  { label: 'Aeródromos', href: '#' },
]

const ease = { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const, delay: 0.3 }

export default function Navbar() {
  return (
    <>
      {/* ── Mobile: só a marca, pill compacto e centrado ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={ease}
        className="md:hidden glass absolute z-10 rounded-full"
        style={{
          top: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          padding: '8px 20px',
          whiteSpace: 'nowrap',
          textAlign: 'center',
        }}
      >
        <span className="block text-white" style={{ fontWeight: 900, fontSize: 11, letterSpacing: '0.30em' }}>
          VERTICAL JUMP
        </span>
        <span className="block" style={{ fontWeight: 700, fontSize: 7.5, letterSpacing: '0.36em', color: 'rgba(255,255,255,0.5)' }}>
          PARAQUEDISMO
        </span>
      </motion.div>

      {/* ── Desktop/tablet: nav completo ── */}
      <motion.nav
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={ease}
        className="glass hidden md:flex items-center justify-between absolute z-10 rounded-full"
        style={{
          top: 20,
          left: 24,
          right: 24,
          padding: '10px 24px',
          fontWeight: 600,
          fontSize: '13.5px',
        }}
      >
        {/* Links — só em desktop */}
        <ul className="hidden lg:flex items-center list-none" style={{ gap: 28 }}>
          {navLinks.map(link => (
            <li key={link.label}>
              <a href={link.href} className="text-white no-underline transition-opacity duration-150 hover:opacity-60">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Brand mark */}
        <div className="flex flex-col items-center gap-[2px] text-white">
          <span style={{ fontWeight: 900, fontSize: 12, letterSpacing: '0.30em' }}>VERTICAL JUMP</span>
          <span style={{ fontWeight: 700, fontSize: 8, letterSpacing: '0.38em', color: 'rgba(255,255,255,0.5)' }}>
            PARAQUEDISMO
          </span>
        </div>

        {/* Telefone */}
        <a
          href="tel:+5581999999999"
          className="text-white no-underline tabular-nums transition-opacity duration-150 hover:opacity-60"
          style={{ fontWeight: 600, fontSize: '13.5px' }}
        >
          +55 81 9999-9999
        </a>
      </motion.nav>
    </>
  )
}
