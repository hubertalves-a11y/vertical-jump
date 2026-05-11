'use client'

import { motion, AnimatePresence } from 'framer-motion'

const PHONE = '5581999999999'

const OPTIONS = [
  {
    label: 'Salto VIP',
    tag: 'EXPERIÊNCIA PREMIUM',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    color: '#2D6BFF',
    headline: 'A experiência completa do céu',
    bullets: [
      'Instrutor dedicado exclusivamente a você',
      'Fotos e vídeo profissional inclusos',
      'Briefing personalizado e sem pressa',
      'Melhor posição de saída da aeronave',
      'Lembrança para a vida toda',
    ],
    waText: 'Olá! Gostaria de agendar um Salto VIP na Vertical Jump.',
  },
  {
    label: 'Salto Selfie',
    tag: 'PRIMEIRA EXPERIÊNCIA',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
    ),
    color: '#05080F',
    headline: 'A adrenalina na palma da mão',
    bullets: [
      'Câmera GoPro na mão do instrutor',
      'Você captura a emoção do salto',
      'Ideal para a primeira vez',
      'Registro autêntico e inesquecível',
      'Compartilhe nos stories na hora',
    ],
    waText: 'Olá! Gostaria de agendar um Salto Selfie na Vertical Jump.',
  },
]

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function BookingModal({ isOpen, onClose }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 2000,
            background: 'rgba(5,8,15,0.88)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <motion.div
            initial={{ scale: 0.9, y: 32, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.92, y: 24, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: '#fff',
              borderRadius: 28,
              width: '100%',
              maxWidth: 760,
              maxHeight: '92vh',
              overflowY: 'auto',
              padding: '40px 36px 36px',
              position: 'relative',
            }}
          >
            {/* Close */}
            <button
              onClick={onClose}
              aria-label="Fechar"
              style={{
                position: 'absolute',
                top: 18,
                right: 18,
                width: 36,
                height: 36,
                borderRadius: '50%',
                border: 'none',
                background: 'rgba(5,8,15,0.07)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#05080F',
                fontSize: 20,
                fontWeight: 300,
                lineHeight: 1,
              }}
            >
              ×
            </button>

            {/* Header */}
            <div style={{ marginBottom: 32, paddingRight: 24 }}>
              <p style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.22em',
                color: '#2D6BFF',
                textTransform: 'uppercase',
                marginBottom: 8,
                fontFamily: 'var(--font-hanken), system-ui, sans-serif',
              }}>
                VERTICAL JUMP — PARAQUEDISMO
              </p>
              <h2 style={{
                fontSize: 'clamp(22px, 4vw, 32px)',
                fontWeight: 800,
                letterSpacing: '-0.025em',
                color: '#05080F',
                lineHeight: 1.1,
                fontFamily: 'var(--font-hanken), system-ui, sans-serif',
              }}>
                Escolha a sua experiência
              </h2>
            </div>

            {/* Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: 16,
            }}>
              {OPTIONS.map((opt, i) => (
                <motion.div
                  key={opt.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.1 + i * 0.08 }}
                  style={{
                    border: '1.5px solid rgba(5,8,15,0.10)',
                    borderRadius: 20,
                    padding: '28px 24px 24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0,
                    background: '#fafafa',
                  }}
                >
                  {/* Icon */}
                  <div style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: opt.color,
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 20,
                    flexShrink: 0,
                  }}>
                    {opt.icon}
                  </div>

                  {/* Tag */}
                  <p style={{
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: '0.20em',
                    color: opt.color,
                    textTransform: 'uppercase',
                    marginBottom: 6,
                    fontFamily: 'var(--font-hanken), system-ui, sans-serif',
                  }}>
                    {opt.tag}
                  </p>

                  {/* Title */}
                  <h3 style={{
                    fontSize: 20,
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    color: '#05080F',
                    lineHeight: 1.15,
                    marginBottom: 8,
                    fontFamily: 'var(--font-hanken), system-ui, sans-serif',
                  }}>
                    {opt.label}
                  </h3>

                  {/* Headline */}
                  <p style={{
                    fontSize: 13,
                    fontWeight: 400,
                    color: 'rgba(5,8,15,0.52)',
                    lineHeight: 1.5,
                    marginBottom: 20,
                    fontFamily: 'var(--font-hanken), system-ui, sans-serif',
                  }}>
                    {opt.headline}
                  </p>

                  {/* Bullets */}
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: '0 0 28px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                  }}>
                    {opt.bullets.map(b => (
                      <li key={b} style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 10,
                        fontSize: 13,
                        color: '#05080F',
                        lineHeight: 1.4,
                        fontFamily: 'var(--font-hanken), system-ui, sans-serif',
                      }}>
                        <span style={{
                          width: 18,
                          height: 18,
                          borderRadius: '50%',
                          background: opt.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          marginTop: 1,
                        }}>
                          <svg width="8" height="8" viewBox="0 0 12 10" fill="none">
                            <polyline points="1,5 4,8 11,1" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                        {b}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <a
                    href={`https://wa.me/${PHONE}?text=${encodeURIComponent(opt.waText)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      padding: '13px 20px',
                      background: opt.color,
                      color: '#fff',
                      borderRadius: 999,
                      textDecoration: 'none',
                      fontWeight: 700,
                      fontSize: 14,
                      letterSpacing: '-0.01em',
                      fontFamily: 'var(--font-hanken), system-ui, sans-serif',
                      marginTop: 'auto',
                      transition: 'opacity 0.2s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                  >
                    Quero agendar
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </a>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
