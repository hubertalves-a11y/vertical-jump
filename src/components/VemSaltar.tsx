'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'

// Extra scroll height on mobile so the fan stays sticky while user cycles cards
const MOBILE_SCROLL_ROOM = 350

const CONFIGS = {
  desktop: [
    { rotate: -24, x: -340, y: -22, hoverY: -46, z: 1, delay: 0.10 },
    { rotate: -12, x: -170, y: -44, hoverY: -68, z: 2, delay: 0.20 },
    { rotate:   0, x:    0, y: -54, hoverY: -78, z: 3, delay: 0.30 },
    { rotate:  12, x:  170, y: -44, hoverY: -68, z: 2, delay: 0.40 },
    { rotate:  24, x:  340, y: -22, hoverY: -46, z: 1, delay: 0.50 },
  ],
  tablet: [
    { rotate: -22, x: -270, y: -10, hoverY: -34, z: 1, delay: 0.10 },
    { rotate: -11, x: -135, y: -32, hoverY: -56, z: 2, delay: 0.20 },
    { rotate:   0, x:    0, y: -40, hoverY: -64, z: 3, delay: 0.30 },
    { rotate:  11, x:  135, y: -32, hoverY: -56, z: 2, delay: 0.40 },
    { rotate:  22, x:  270, y: -10, hoverY: -34, z: 1, delay: 0.50 },
  ],
  // Mobile uses same fan as desktop but compressed — scroll drives active card
  mobile: [
    { rotate: -18, x: -72, y: -6,  hoverY: -22, z: 1, delay: 0.10 },
    { rotate:  -9, x: -36, y: -18, hoverY: -34, z: 2, delay: 0.20 },
    { rotate:   0, x:   0, y: -22, hoverY: -38, z: 3, delay: 0.30 },
    { rotate:   9, x:  36, y: -18, hoverY: -34, z: 2, delay: 0.40 },
    { rotate:  18, x:  72, y: -6,  hoverY: -22, z: 1, delay: 0.50 },
  ],
}

const DIMS = {
  desktop: { w: 268, h: 360, containerH: 480 },
  tablet:  { w: 212, h: 296, containerH: 400 },
  mobile:  { w: 132, h: 188, containerH: 340 },
}

const VIDEO_SRCS = [
  '/videos/social-1.mp4',
  '/videos/social-2.mp4',
  '/videos/social-3.mp4',
  '/videos/social-4.mp4',
  '/videos/social-5.mp4',
]

const CARD_BG = [
  'linear-gradient(160deg, #05080F 0%, #1a2f6e 100%)',
  'linear-gradient(160deg, #071828 0%, #2D6BFF 100%)',
  'linear-gradient(160deg, #050e1f 0%, #0d3785 100%)',
  'linear-gradient(160deg, #0a1830 0%, #2D6BFF 100%)',
  'linear-gradient(160deg, #05080F 0%, #1535a0 100%)',
]

type Cfg = typeof CONFIGS.desktop[0]
type Screen = 'desktop' | 'tablet' | 'mobile'

// ── Card individual ────────────────────────────────────────────────
function VideoCard({
  index, cfg, w, h, inView, onOpen, isActive, isMobile,
}: {
  index: number
  cfg: Cfg
  w: number
  h: number
  inView: boolean
  onOpen: (src: string) => void
  isActive: boolean
  isMobile: boolean
}) {
  const [hovered, setHovered] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // On mobile: scroll-driven active state; on desktop/tablet: mouse hover
  const elevated = isMobile ? isActive : hovered

  useEffect(() => {
    const vid = videoRef.current
    if (!vid) return
    if (elevated) {
      vid.play().catch(() => {})
    } else {
      vid.pause()
      vid.currentTime = 0
    }
  }, [elevated])

  const baseTransform = `rotate(${cfg.rotate}deg) translateX(${cfg.x}px) translateY(${cfg.y}px)`
  const elevTransform = `rotate(${cfg.rotate}deg) translateX(${cfg.x}px) translateY(${cfg.hoverY}px) scale(1.05)`

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1], delay: cfg.delay }}
      onMouseEnter={() => { if (!isMobile) setHovered(true) }}
      onMouseLeave={() => { if (!isMobile) setHovered(false) }}
      onClick={() => onOpen(VIDEO_SRCS[index])}
      style={{
        position: 'absolute',
        width: w,
        height: h,
        borderRadius: 20,
        overflow: 'hidden',
        cursor: 'pointer',
        zIndex: elevated ? 10 : cfg.z,
        background: CARD_BG[index],
        transform: elevated ? elevTransform : baseTransform,
        boxShadow: elevated
          ? '0 28px 72px rgba(0,0,0,0.32)'
          : '0 8px 32px rgba(0,0,0,0.18)',
        transition: 'transform 0.6s cubic-bezier(0.23,1,0.32,1), box-shadow 0.6s ease',
        outline: isMobile && isActive ? '2px solid rgba(45,107,255,0.55)' : 'none',
        outlineOffset: 4,
      }}
    >
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          transform: elevated ? 'scale(1.1)' : 'scale(1)',
          transition: 'transform 0.6s cubic-bezier(0.23,1,0.32,1)',
        }}
      >
        <source src={VIDEO_SRCS[index]} type="video/mp4" />
      </video>

      {/* Gradient overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.48) 100%)',
        opacity: elevated ? 1 : 0,
        transition: 'opacity 0.4s ease',
        zIndex: 1,
        pointerEvents: 'none',
      }} />

      {/* Play indicator */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%) scale(${elevated ? 1 : 0.78})`,
        width: isMobile ? 48 : 64,
        height: isMobile ? 48 : 64,
        background: 'rgba(255,255,255,0.96)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: elevated ? 1 : 0,
        transition: 'all 0.35s cubic-bezier(0.23,1,0.32,1)',
        zIndex: 2,
        pointerEvents: 'none',
        boxShadow: '0 8px 24px rgba(0,0,0,0.22)',
      }}>
        <svg width={isMobile ? 13 : 18} height={isMobile ? 13 : 18} viewBox="0 0 24 24" fill="#111">
          <polygon points="6,3 20,12 6,21" />
        </svg>
      </div>

      {/* "Ver vídeo" label */}
      <p style={{
        position: 'absolute',
        bottom: 12,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: 'rgba(255,255,255,0.8)',
        fontSize: isMobile ? 8 : 10,
        fontWeight: 700,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        zIndex: 2,
        opacity: elevated ? 1 : 0,
        transition: 'opacity 0.3s ease',
        fontFamily: 'var(--font-hanken), system-ui, sans-serif',
      }}>
        Ver vídeo
      </p>
    </motion.div>
  )
}

// ── Seção principal ────────────────────────────────────────────────
export default function VemSaltar() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-8%' })

  const [screen, setScreen] = useState<Screen>('desktop')
  const [activeVideo, setActiveVideo] = useState<string | null>(null)
  const [activeIndex, setActiveIndex] = useState(2) // center card default
  const modalVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      setScreen(w < 768 ? 'mobile' : w < 1024 ? 'tablet' : 'desktop')
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // Scroll-driven card activation (mobile only).
  // Cards cycle in center-outward order so raw=0 (section entering view) maps to card 2,
  // matching the default — no visual jump on arrival.
  // Order: center → right → far-right → left → far-left
  const CARD_ORDER = [2, 3, 4, 1, 0]

  useEffect(() => {
    if (screen !== 'mobile') return
    const onScroll = () => {
      const section = sectionRef.current
      if (!section) return
      const scrollRange = section.offsetHeight - window.innerHeight
      if (scrollRange <= 0) return
      const raw = (window.scrollY - section.offsetTop) / scrollRange
      if (raw < 0) return
      const step = Math.min(4, Math.floor(Math.min(1, raw) * 5))
      setActiveIndex(CARD_ORDER[step])
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeModal() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  function openModal(src: string) {
    setActiveVideo(src)
    setTimeout(() => modalVideoRef.current?.play().catch(() => {}), 120)
  }

  function closeModal() {
    if (modalVideoRef.current) { modalVideoRef.current.pause(); modalVideoRef.current.currentTime = 0 }
    setActiveVideo(null)
  }

  const cfgs = CONFIGS[screen]
  const { w, h, containerH } = DIMS[screen]
  const isMobile = screen === 'mobile'

  return (
    <>
      <section
        ref={sectionRef}
        style={{
          background: '#f5f5f5',
          position: 'relative',
          // On mobile: extra height at bottom creates scroll room for card cycling
          paddingBottom: isMobile ? MOBILE_SCROLL_ROOM : 0,
        }}
      >
        {/* Sticky wrapper on mobile: stays visible while user scrolls through padding */}
        <div style={{
          position: isMobile ? 'sticky' : 'static',
          top: 0,
          background: '#f5f5f5',
          padding: isMobile ? '72px 24px 60px' : '120px 40px 180px',
          // On mobile, fill the viewport so the section always looks full-screen
          minHeight: isMobile ? '100svh' : 'auto',
          display: isMobile ? 'flex' : 'block',
          flexDirection: isMobile ? 'column' : undefined,
          justifyContent: isMobile ? 'center' : undefined,
        }}>
          <div style={{ maxWidth: 1400, margin: '0 auto' }}>

            {/* Cabeçalho */}
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              style={{ textAlign: 'center', marginBottom: isMobile ? 56 : 100 }}
            >
              <h2 style={{
                fontSize: isMobile ? 'clamp(30px, 8vw, 40px)' : 'clamp(40px, 5.5vw, 72px)',
                fontWeight: 700,
                letterSpacing: '-0.022em',
                lineHeight: 1,
                marginBottom: 8,
                color: '#05080F',
                fontFamily: 'var(--font-hanken), system-ui, sans-serif',
              }}>
                VEM SALTAR COM A
              </h2>
              <p style={{
                fontSize: isMobile ? 'clamp(13px, 3.5vw, 17px)' : 'clamp(18px, 2.8vw, 32px)',
                fontWeight: 400,
                fontStyle: 'italic',
                letterSpacing: '0.02em',
                color: '#05080F',
                fontFamily: 'var(--font-hanken), system-ui, sans-serif',
                opacity: 0.65,
              }}>
                VERTICAL JUMP
              </p>
            </motion.div>

            {/* Fan de cards */}
            <div style={{
              position: 'relative',
              height: containerH,
              // On desktop/tablet: overflow visible so rotated edge cards aren't clipped.
              // On mobile: clip prevents a sliver of horizontal scroll.
              maxWidth: isMobile ? '100%' : 1100,
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: isMobile ? 'clip' : 'visible',
            }}>
              {cfgs.map((cfg, i) => (
                <VideoCard
                  key={i}
                  index={i}
                  cfg={cfg}
                  w={w}
                  h={h}
                  inView={inView}
                  onOpen={openModal}
                  isActive={isMobile ? activeIndex === i : false}
                  isMobile={isMobile}
                />
              ))}
            </div>

            {/* Dots indicator (mobile only) */}
            {isMobile && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.9 }}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 8,
                  marginTop: 36,
                }}
              >
                {[2, 3, 4, 1, 0].map((cardIdx) => (
                  <div
                    key={cardIdx}
                    style={{
                      width: activeIndex === cardIdx ? 22 : 6,
                      height: 6,
                      borderRadius: 3,
                      background: activeIndex === cardIdx ? '#2D6BFF' : 'rgba(5,8,15,0.18)',
                      transition: 'all 0.4s cubic-bezier(0.23,1,0.32,1)',
                    }}
                  />
                ))}
              </motion.div>
            )}

            {/* Hint de scroll (mobile) — visível no estado inicial (card central) */}
            {isMobile && activeIndex === 2 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: 1.1 }}
                style={{
                  textAlign: 'center',
                  marginTop: 16,
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: '0.18em',
                  color: 'rgba(5,8,15,0.35)',
                  textTransform: 'uppercase',
                  fontFamily: 'var(--font-hanken), system-ui, sans-serif',
                }}
              >
                Role para explorar
              </motion.p>
            )}

          </div>
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={(e) => { if (e.target === e.currentTarget) closeModal() }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1000,
              background: 'rgba(0,0,0,0.94)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <button
              onClick={closeModal}
              aria-label="Fechar"
              style={{
                position: 'absolute',
                top: 20,
                right: 20,
                width: 44,
                height: 44,
                background: 'rgba(255,255,255,0.18)',
                backdropFilter: 'blur(8px)',
                border: 'none',
                borderRadius: '50%',
                color: '#fff',
                fontSize: 26,
                fontWeight: 300,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
                transition: 'background 0.2s',
              }}
            >
              ×
            </button>

            <motion.div
              initial={{ scale: 0.88, y: 36, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.88, y: 36, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
              style={{
                maxWidth: 480,
                width: '90vw',
                maxHeight: '90vh',
                background: '#000',
                borderRadius: 24,
                overflow: 'hidden',
                boxShadow: '0 32px 96px rgba(0,0,0,0.5)',
              }}
            >
              <video
                ref={modalVideoRef}
                key={activeVideo}
                controls
                playsInline
                style={{ display: 'block', width: '100%', maxHeight: '90vh', objectFit: 'contain' }}
              >
                <source src={activeVideo} type="video/mp4" />
              </video>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
