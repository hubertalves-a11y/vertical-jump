'use client'

import { useEffect, useRef, useCallback } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { useLenis } from './LenisProvider'
import { useImagePreloader } from '@/hooks/useImagePreloader'
import Navbar from './Navbar'
import HeroSubblock from './HeroSubblock'
import HeroCTA from './HeroCTA'
import ScrollIndicator from './ScrollIndicator'

const FRAME_COUNT = 119

function getFramePath(index: number): string {
  const num = String(index + 1).padStart(3, '0')
  return `/sequence-1/ezgif-frame-${num}.jpg`
}

export default function HeroScroll() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const currentFrameRef = useRef(0)
  // Refs to avoid stale closures in scroll callback
  const imagesRef = useRef<HTMLImageElement[]>([])
  const loadedRef = useRef(false)

  const { lenis } = useLenis()
  const scrollProgress = useMotionValue(0)
  const overlayOpacity = useTransform(scrollProgress, [0, 0.15, 0.4], [1, 1, 0])

  const { images, loaded, progress: loadProgress } = useImagePreloader(FRAME_COUNT, getFramePath)

  // Keep refs in sync with state
  useEffect(() => {
    imagesRef.current = images
    loadedRef.current = loaded
  }, [images, loaded])

  // Draw a single frame onto the canvas using cover-fit scaling
  const drawFrame = useCallback((img: HTMLImageElement) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const cw = canvas.width
    const ch = canvas.height
    const iw = img.naturalWidth
    const ih = img.naturalHeight
    if (!iw || !ih) return

    const scale = Math.max(cw / iw, ch / ih)
    const dw = iw * scale
    const dh = ih * scale
    const dx = (cw - dw) / 2
    const dy = (ch - dh) / 2

    ctx.clearRect(0, 0, cw, ch)
    ctx.drawImage(img, dx, dy, dw, dh)
  }, [])

  // Resize canvas buffer to match viewport, then redraw current frame
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const img = imagesRef.current[currentFrameRef.current]
    if (img?.complete) drawFrame(img)
  }, [drawFrame])

  // Called by Lenis on every scroll tick — lenis instance is passed as argument
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleScroll = useCallback((e: any) => {
    const section = sectionRef.current
    if (!section || !loadedRef.current) return

    // Lenis 1.x passes the Lenis instance; scroll value is e.scroll
    const scrollY: number = typeof e?.scroll === 'number' ? e.scroll : window.scrollY

    const sectionTop = section.offsetTop
    const sectionH = section.offsetHeight
    const windowH = window.innerHeight
    const scrollable = sectionH - windowH

    const raw = (scrollY - sectionTop) / scrollable
    const clamped = Math.max(0, Math.min(1, raw))

    scrollProgress.set(clamped)

    const frameIndex = Math.min(FRAME_COUNT - 1, Math.floor(clamped * FRAME_COUNT))
    if (frameIndex === currentFrameRef.current) return
    currentFrameRef.current = frameIndex

    // Draw directly — Lenis already fires once per RAF, no extra scheduling needed
    const img = imagesRef.current[frameIndex]
    if (img?.complete) drawFrame(img)
  }, [scrollProgress, drawFrame])

  // Wire up Lenis scroll listener
  useEffect(() => {
    if (!lenis) return
    lenis.on('scroll', handleScroll)
    return () => {
      lenis.off('scroll', handleScroll)
    }
  }, [lenis, handleScroll])

  // Canvas sizing
  useEffect(() => {
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    return () => window.removeEventListener('resize', resizeCanvas)
  }, [resizeCanvas])

  // Draw frame 0 once all images have loaded
  useEffect(() => {
    if (loaded && images[0]?.complete) {
      resizeCanvas()
      drawFrame(images[0])
    }
  }, [loaded, images, drawFrame, resizeCanvas])

  return (
    <section ref={sectionRef} className="relative" style={{ height: '500vh' }}>
      {/* Sticky viewport — the canvas + UI layer that sticks during scroll */}
      <div className="sticky top-0 h-screen w-full overflow-hidden" style={{ background: '#05080F' }}>

        {/* Static fallback background (visible while frames load) */}
        <div
          className="absolute inset-[-3%] z-0 will-change-transform animate-drift"
          style={{
            backgroundImage: 'url(/images/skydive-pov.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        {/* Canvas — renders the scroll-driven frame sequence */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 z-[1]"
          style={{
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.5s ease',
            width: '100%',
            height: '100%',
          }}
        />

        {/* Loading progress bar */}
        {!loaded && (
          <div
            className="absolute bottom-0 left-0 h-[2px] z-20 transition-all duration-300"
            style={{ width: `${loadProgress * 100}%`, background: '#2D6BFF' }}
          />
        )}

        {/* Scrim — top fade */}
        <div
          className="pointer-events-none absolute inset-0 z-[2]"
          style={{ background: 'linear-gradient(180deg, rgba(5,8,15,0.22) 0%, rgba(5,8,15,0) 16%)' }}
        />
        {/* Scrim — bottom fade */}
        <div
          className="pointer-events-none absolute inset-0 z-[2]"
          style={{ background: 'linear-gradient(180deg, rgba(5,8,15,0) 68%, rgba(5,8,15,0.20) 90%, rgba(5,8,15,0.38) 100%)' }}
        />

        {/* UI Overlay — fades out as user scrolls (the jump effect) */}
        <motion.div className="absolute inset-0 z-[3]" style={{ opacity: overlayOpacity }}>
          <Navbar />
          <HeroSubblock />
          <HeroCTA />
          <ScrollIndicator />
        </motion.div>
      </div>
    </section>
  )
}
