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
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
      className="glass absolute z-10 flex items-center justify-between rounded-full"
      style={{
        top: 24,
        left: 32,
        right: 32,
        padding: '14px 26px',
        fontWeight: 600,
        fontSize: '14.5px',
      }}
    >
      {/* Nav links */}
      <ul className="flex items-center list-none" style={{ gap: 36 }}>
        {navLinks.map(link => (
          <li key={link.label}>
            <a
              href={link.href}
              className="text-white no-underline transition-opacity duration-150 hover:opacity-70"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      {/* Centre brand mark */}
      <div className="hidden xl:flex flex-col items-center gap-[3px] text-white" aria-hidden="true">
        <span style={{ fontWeight: 900, fontSize: 13, letterSpacing: '0.32em' }}>VERTICAL JUMP</span>
        <span style={{ fontWeight: 700, fontSize: 9, letterSpacing: '0.4em', color: 'rgba(255,255,255,0.6)' }}>
          PARAQUEDISMO
        </span>
      </div>

      {/* Contact links */}
      <div className="flex items-center" style={{ gap: 28 }}>
        <a
          href="tel:+5581999999999"
          className="text-white no-underline tabular-nums transition-opacity duration-150 hover:opacity-70"
          style={{ fontWeight: 600, fontSize: '14.5px' }}
        >
          +55 81 9999-9999
        </a>
        <a
          href="mailto:contato@verticaljump.com.br"
          className="text-white no-underline transition-opacity duration-150 hover:opacity-70"
          style={{ fontWeight: 600, fontSize: '14.5px' }}
        >
          contato@verticaljump.com.br
        </a>
      </div>
    </motion.nav>
  )
}
