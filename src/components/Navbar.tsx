'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { label: 'A Vertical', href: '#' },
  { label: 'Modalidades', href: '#' },
  { label: 'Curso AFF', href: '#' },
  { label: 'Aeródromos', href: '#' },
]

const ease = { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const, delay: 0.3 }

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      {/* ── Mobile: brand pill centrado + botão menu ── */}
      <div className="md:hidden absolute z-10 w-full" style={{ top: 16 }}>
        {/* Wrapper full-width para centralizar sem transform conflict */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={ease}
            className="glass rounded-full"
            style={{ padding: '8px 20px', whiteSpace: 'nowrap', textAlign: 'center' }}
          >
            <span className="block text-white" style={{ fontWeight: 900, fontSize: 11, letterSpacing: '0.30em' }}>
              VERTICAL JUMP
            </span>
            <span className="block" style={{ fontWeight: 700, fontSize: 7.5, letterSpacing: '0.36em', color: 'rgba(255,255,255,0.5)' }}>
              PARAQUEDISMO
            </span>
          </motion.div>
        </div>

        {/* Botão menu — canto superior direito */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ ...ease, delay: 0.5 }}
          onClick={() => setMenuOpen(true)}
          aria-label="Abrir menu"
          className="glass absolute rounded-full"
          style={{
            top: 0,
            right: 16,
            width: 40,
            height: 40,
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 5,
          }}
        >
          <span style={{ display: 'block', width: 16, height: 1.5, background: 'rgba(255,255,255,0.9)', borderRadius: 2 }} />
          <span style={{ display: 'block', width: 10, height: 1.5, background: 'rgba(255,255,255,0.9)', borderRadius: 2 }} />
        </motion.button>
      </div>

      {/* ── Desktop/tablet: nav completo ── */}
      <motion.nav
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={ease}
        className="glass hidden md:flex items-center justify-between absolute z-10 rounded-full"
        style={{ top: 20, left: 24, right: 24, padding: '10px 24px', fontWeight: 600, fontSize: '13.5px' }}
      >
        <ul className="hidden lg:flex items-center list-none" style={{ gap: 28 }}>
          {navLinks.map(link => (
            <li key={link.label}>
              <a href={link.href} className="text-white no-underline transition-opacity duration-150 hover:opacity-60">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex flex-col items-center gap-[2px] text-white">
          <span style={{ fontWeight: 900, fontSize: 12, letterSpacing: '0.30em' }}>VERTICAL JUMP</span>
          <span style={{ fontWeight: 700, fontSize: 8, letterSpacing: '0.38em', color: 'rgba(255,255,255,0.5)' }}>
            PARAQUEDISMO
          </span>
        </div>

        <a
          href="tel:+5581999999999"
          className="text-white no-underline tabular-nums transition-opacity duration-150 hover:opacity-60"
          style={{ fontWeight: 600, fontSize: '13.5px' }}
        >
          +55 81 9999-9999
        </a>
      </motion.nav>

      {/* ── Mobile menu modal ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setMenuOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 200,
              background: 'rgba(5,8,15,0.7)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
            }}
          >
            {/* Painel deslizante */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              onClick={e => e.stopPropagation()}
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: '#05080F',
                borderTop: '1px solid rgba(255,255,255,0.10)',
                borderRadius: '28px 28px 0 0',
                padding: '32px 32px 48px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Handle */}
              <div style={{
                width: 36,
                height: 4,
                background: 'rgba(255,255,255,0.18)',
                borderRadius: 2,
                alignSelf: 'center',
                marginBottom: 36,
              }} />

              {/* Marca */}
              <div style={{ marginBottom: 40 }}>
                <p style={{ fontSize: 10, letterSpacing: '0.34em', color: 'rgba(255,255,255,0.38)', fontWeight: 700, marginBottom: 4 }}>
                  PARAQUEDISMO
                </p>
                <p style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-0.01em', color: '#fff', lineHeight: 1 }}>
                  VERTICAL JUMP
                </p>
              </div>

              {/* Links */}
              <nav style={{ display: 'flex', flexDirection: 'column', gap: 0, marginBottom: 48 }}>
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.08 + i * 0.06 }}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '18px 0',
                      borderBottom: '1px solid rgba(255,255,255,0.07)',
                      color: '#fff',
                      textDecoration: 'none',
                      fontSize: 22,
                      fontWeight: 700,
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {link.label}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </motion.a>
                ))}
              </nav>

              {/* Rodapé com CTA */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.36 }}
                style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
              >
                <a
                  href="tel:+5581999999999"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    padding: '14px 24px',
                    background: '#2D6BFF',
                    borderRadius: 999,
                    color: '#fff',
                    textDecoration: 'none',
                    fontWeight: 700,
                    fontSize: 15,
                    letterSpacing: '-0.01em',
                  }}
                >
                  Agendar salto
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3v15" /><polyline points="6 12 12 18 18 12" />
                  </svg>
                </a>

                <a
                  href="tel:+5581999999999"
                  style={{
                    textAlign: 'center',
                    color: 'rgba(255,255,255,0.45)',
                    textDecoration: 'none',
                    fontSize: 13,
                    fontWeight: 500,
                    letterSpacing: '0.02em',
                  }}
                >
                  +55 81 9999-9999
                </a>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
