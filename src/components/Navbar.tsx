'use client'

import { motion } from 'framer-motion'

const navLinks = [
  { label: 'A Vertical', href: '#' },
  { label: 'Modalidades', href: '#' },
  { label: 'Curso AFF', href: '#' },
  { label: 'Aeródromos', href: '#' },
]

export default function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
      className="glass absolute z-10 flex items-center justify-between rounded-full"
      style={{
        top: 20,
        left: 20,
        right: 20,
        padding: '10px 22px',
        fontWeight: 600,
        fontSize: '13.5px',
      }}
    >
      {/* Nav links — só desktop */}
      <ul className="hidden lg:flex items-center list-none" style={{ gap: 28 }}>
        {navLinks.map(link => (
          <li key={link.label}>
            <a
              href={link.href}
              className="text-white no-underline transition-opacity duration-150 hover:opacity-60"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      {/* Brand mark — sempre visível */}
      <div className="flex flex-col items-center gap-[2px] text-white">
        <span style={{ fontWeight: 900, fontSize: 12, letterSpacing: '0.30em' }}>
          VERTICAL JUMP
        </span>
        <span style={{ fontWeight: 700, fontSize: 8, letterSpacing: '0.38em', color: 'rgba(255,255,255,0.55)' }}>
          PARAQUEDISMO
        </span>
      </div>

      {/* Telefone — some em mobile */}
      <a
        href="tel:+5581999999999"
        className="hidden sm:block text-white no-underline tabular-nums transition-opacity duration-150 hover:opacity-60"
        style={{ fontWeight: 600, fontSize: '13.5px' }}
      >
        +55 81 9999-9999
      </a>

      {/* Placeholder para manter brand centrado em mobile */}
      <div className="sm:hidden w-6" aria-hidden="true" />
    </motion.nav>
  )
}
