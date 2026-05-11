'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'

// Fan transforms por breakpoint
const CONFIGS = {
  desktop: [
    { rotate: -24, x: -320, y: -20,  hoverY: -40,  z: 1, delay: 0.10 },
    { rotate: -12, x: -160, y: -40,  hoverY: -60,  z: 2, delay: 0.20 },
    { rotate:   0, x:    0, y: -48,  hoverY: -68,  z: 3, delay: 0.30 },
    { rotate:  12, x:  160, y: -40,  hoverY: -60,  z: 2, delay: 0.40 },
    { rotate:  24, x:  320, y: -20,  hoverY: -40,  z: 1, delay: 0.50 },
  ],
  tablet: [
    { rotate: -22, x: -260, y: -10,  hoverY: -30,  z: 1, delay: 0.10 },
    { rotate: -11, x: -130, y: -30,  hoverY: -50,  z: 2, delay: 0.20 },
    { rotate:   0, x:    0, y: -36,  hoverY: -56,  z: 3, delay: 0.30 },
    { rotate:  11, x:  130, y: -30,  hoverY: -50,  z: 2, delay: 0.40 },
    { rotate:  22, x:  260, y: -10,  hoverY: -30,  z: 1, delay: 0.50 },
  ],
  mobile: [
    { rotate: -12, x: 0, y: -160, hoverY: -168, z: 1, delay: 0.10 },
    { rotate:  -6, x: 0, y:  -80, hoverY:  -88, z: 2, delay: 0.20 },
    { rotate:   0, x: 0, y:    0, hoverY:   -8, z: 3, delay: 0.30 },
    { rotate:   6, x: 0, y:   80, hoverY:   72, z: 2, delay: 0.40 },
    { rotate:  12, x: 0, y:  160, hoverY:  152, z: 1, delay: 0.50 },
  ],
}

// Dimensões dos cards por breakpoint
const DIMS = {
  desktop: { w: 240, h: 320, containerH: 400 },
  tablet:  { w: 200, h: 280, containerH: 380 },
  mobile:  { w: 160, h: 240, containerH: 500 },
}

// Substituir pelas src reais quando tiver os vídeos em /public/videos/
const VIDEO_SRCS = [
  '/videos/social-1.mp4',
  '/videos/social-2.mp4',
  '/videos/social-3.mp4',
  '/videos/social-4.mp4',
  '/videos/social-5.mp4',
]

// Placeholders visuais enquanto os vídeos não existirem
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
  index, cfg, w, h, inView, onOpen,
}: {
  index: number
  cfg: Cfg
  w: number
  h: number
  inView: boolean
  onOpen: (src: string) => void
}) {
  const [hovered, setHovered] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const baseTransform = `rotate(${cfg.rotate}deg) translateX(${cfg.x}px) translateY(${cfg.y}px)`
  const hoverTransform = `rotate(${cfg.rotate}deg) translateX(${cfg.x}px) translateY(${cfg.hoverY}px) scale(1.05)`

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1], delay: cfg.delay }}
      onMouseEnter={() => { setHovered(true);  videoRef.current?.play().catch(() => {}) }}
      onMouseLeave={() => { setHovered(false); if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0 } }}
      onClick={() => onOpen(VIDEO_SRCS[index])}
      style={{
        position: 'absolute',
        width: w,
        height: h,
        borderRadius: 20,
        overflow: 'hidden',
        cursor: 'pointer',
        zIndex: hovered ? 10 : cfg.z,
        background: CARD_BG[index],
        transform: hovered ? hoverTransform : baseTransform,
        boxShadow: hovered ? '0 24px 64px rgba(0,0,0,0.28)' : '0 8px 32px rgba(0,0,0,0.18)',
        transition: 'transform 0.6s cubic-bezier(0.23,1,0.32,1), box-shadow 0.6s ease',
      }}
    >
      {/* Vídeo — colocar arquivos em /public/videos/ */}
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
          transform: hovered ? 'scale(1.1)' : 'scale(1)',
          transition: 'transform 0.6s cubic-bezier(0.23,1,0.32,1)',
        }}
      >
        <source src={VIDEO_SRCS[index]} type="video/mp4" />
      </video>

      {/* Gradient overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.45) 100%)',
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.4s ease',
        zIndex: 1,
        pointerEvents: 'none',
      }} />

      {/* Play indicator */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: `translate(-50%, -50%) scale(${hovered ? 1 : 0.82})`,
        width: 64,
        height: 64,
        background: 'rgba(255,255,255,0.96)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: hovered ? 1 : 0,
        transition: 'all 0.35s cubic-bezier(0.23,1,0.32,1)',
        zIndex: 2,
        pointerEvents: 'none',
        boxShadow: '0 8px 24px rgba(0,0,0,0.22)',
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#111">
          <polygon points="6,3 20,12 6,21" />
        </svg>
      </div>

      {/* "Ver vídeo" label */}
      <p style={{
        position: 'absolute',
        bottom: 14,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: 'rgba(255,255,255,0.75)',
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        zIndex: 2,
        opacity: hovered ? 1 : 0,
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
  const modalVideoRef = useRef<HTMLVideoElement>(null)

  // Detecta breakpoint no cliente
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      setScreen(w < 768 ? 'mobile' : w < 1024 ? 'tablet' : 'desktop')
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  // Fecha modal com Escape
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
  const sectionPadding = screen === 'mobile' ? '80px 24px 120px' : '120px 40px 180px'
  const headerMargin = screen === 'mobile' ? 64 : 100

  return (
    <>
      <section
        ref={sectionRef}
        style={{ background: '#f5f5f5', padding: sectionPadding, position: 'relative' }}
      >
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>

          {/* Cabeçalho */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            style={{ textAlign: 'center', marginBottom: headerMargin }}
          >
            <h2 style={{
              fontSize: 'clamp(40px, 5.5vw, 72px)',
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
              fontSize: 'clamp(18px, 2.8vw, 32px)',
              fontWeight: 400,
              fontStyle: 'italic',
              letterSpacing: '0.02em',
              color: '#05080F',
              fontFamily: 'var(--font-hanken), system-ui, sans-serif',
              opacity: 0.7,
            }}>
              VERTICAL JUMP
            </p>
          </motion.div>

          {/* Fan de cards */}
          <div style={{
            position: 'relative',
            height: containerH,
            maxWidth: 1000,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
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
              />
            ))}
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
            {/* Fechar */}
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
                lineHeight: 1,
                zIndex: 10,
                transition: 'background 0.2s',
              }}
            >
              ×
            </button>

            {/* Conteúdo */}
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
