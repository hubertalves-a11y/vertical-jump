# Immersive Agent
### Playbook para criação de sites e seções web cinematográficas com scroll-driven canvas animation

---

## O que este agente faz

Constrói experiências web imersivas baseadas em:
- Sequências de vídeo scrubbing por scroll (canvas animation)
- Design glassmorphism com UI flutuante
- Smooth scroll com Lenis
- Animações de entrada com Framer Motion
- Deploy automatizado GitHub → Netlify

---

## Processo em 7 Fases

```
Fase 0 → Brief & Inventário de Assets
Fase 1 → Auditoria de Qualidade
Fase 2 → Extração de Frames (ffmpeg)
Fase 3 → Setup do Projeto
Fase 4 → Sistema de Animação (Canvas Core)
Fase 5 → Overlay de UI
Fase 6 → Responsividade
Fase 7 → Deploy
```

---

## Fase 0 — Brief & Inventário de Assets

**O que fazer:**
1. Identificar a referência visual (site existente, screenshot, vídeo de referência)
2. Inventariar todos os assets disponíveis:
   - Vídeo original (MP4/MOV)
   - Sequência de imagens (se existir)
   - Imagem hero estática (fallback)
   - HTML/CSS de referência (se houver mock)
3. Identificar a **narrativa do scroll** — o que o usuário vê ao rolar:
   - Estado inicial (frame 1): o ponto de partida emocional
   - Estado médio (frame ~50%): a transição / tensão
   - Estado final (frame N): o destino / resolução

**Perguntas a responder antes de começar:**
- Qual é o sentimento que a animação deve transmitir?
- Quantos segundos tem o vídeo? (determina granularidade dos frames)
- A sequência de frames já existe ou precisa ser extraída?
- Qual o breakpoint crítico para mobile?

**No caso do Vertical Jump:**
- Narrativa: porta do avião → instante do salto → queda livre
- Frames: 40 (5fps × 8s de vídeo)
- Sentimento: coragem, adrenalina, liberdade

---

## Fase 1 — Auditoria de Qualidade dos Assets

**Sempre executar antes de usar qualquer sequência de imagens:**

```bash
# Checar tamanhos dos frames (red flag: < 100KB para 1920×1080)
ls -lh /caminho/sequencia/ | sort -k5 -h

# Checar dimensões e DPI
python3 -c "
import subprocess
files = ['frame-{:03d}.jpg'.format(i) for i in range(1, N+1)]
for f in files:
    r = subprocess.run(['sips', '-g', 'pixelWidth', '-g', 'pixelHeight', f],
                       capture_output=True, text=True)
    print(r.stdout)
"
```

**Tabela de qualidade esperada por resolução:**

| Resolução | Mínimo aceitável | Ideal |
|-----------|-----------------|-------|
| 1920×1080 | 150 KB/frame | 300–500 KB/frame |
| 1280×720  | 80 KB/frame  | 150–300 KB/frame |
| 3840×2160 | 500 KB/frame | 1–2 MB/frame |

**🚨 Red flags automáticos:**
- Nome de arquivo começa com `ezgif-frame-` → extraído de GIF → qualidade degradada
- Frames do meio << tamanho dos frames iniciais → compressão agressiva
- Qualquer frame < 50KB em resolução HD → descartar e re-extrair

**Causa-raiz comum:** pipeline GIF (256 cores) → JPEG cria artefatos irreversíveis.
**Solução:** sempre re-extrair do vídeo original.

---

## Fase 2 — Extração de Frames com ffmpeg

**Instalar ffmpeg (sem homebrew):**
```bash
cd /tmp && npm install ffmpeg-static
# Usar via: /tmp/node_modules/ffmpeg-static/ffmpeg
```

**Inspecionar o vídeo:**
```bash
FFMPEG=/tmp/node_modules/ffmpeg-static/ffmpeg
"$FFMPEG" -i video.mp4 2>&1 | grep -E "Duration|Video:|Stream"
```

**Calcular o número de frames:**
```
frames_desejados = 40 (padrão para sequências de ~5–10s)
fps_extração = frames_desejados / duração_segundos
# Ex: 40 frames / 8s = 5 fps
```

**Extrair com qualidade máxima:**
```bash
FFMPEG=/tmp/node_modules/ffmpeg-static/ffmpeg
"$FFMPEG" -y \
  -i "video_original.mp4" \
  -vf fps=5 \
  -q:v 2 \
  "public/sequence-1/ezgif-frame-%03d.jpg"

# -q:v 2 = qualidade JPEG quase lossless (escala 1-31, menor = melhor)
# -vf fps=5 = 5 frames por segundo → 40 frames em 8s
```

**Verificar resultado:**
```bash
echo "Frames extraídos: $(ls public/sequence-1/ | wc -l)"
echo "Tamanho total: $(du -sh public/sequence-1/)"
ls -lh public/sequence-1/ | sort -k5 -h | tail -3  # maiores = melhor qualidade
```

**Referência de parâmetros por tipo de conteúdo:**

| Tipo de vídeo | FPS extração | Frames recomendados |
|---------------|-------------|---------------------|
| Ação rápida (queda, corrida) | 8–12 fps | 48–80 |
| Movimento médio (paisagem, câmera lenta) | 4–6 fps | 30–48 |
| Lento / contemplativo | 2–4 fps | 20–32 |

---

## Fase 3 — Setup do Projeto Next.js

**Stack padrão:**
```
Next.js 14 (App Router) + TypeScript + Tailwind CSS 3 + Framer Motion 11 + Lenis 1.x
```

**Estrutura de arquivos:**
```
projeto/
├── public/
│   ├── sequence-1/          ← frames JPEG numerados com zero-pad (001, 002...)
│   └── images/
│       └── hero-fallback.jpg  ← imagem estática para loading state
├── src/
│   ├── app/
│   │   ├── layout.tsx       ← root layout + font + LenisProvider
│   │   ├── page.tsx
│   │   └── globals.css      ← @tailwind + .glass + .glass-lite + @keyframes
│   ├── components/
│   │   ├── LenisProvider.tsx   ← smooth scroll context
│   │   ├── HeroScroll.tsx      ← canvas + sticky + scroll logic (NÚCLEO)
│   │   ├── Navbar.tsx
│   │   ├── HeroSubblock.tsx    ← card info inferior esquerdo
│   │   ├── HeroCTA.tsx         ← botão de ação principal
│   │   └── ScrollIndicator.tsx
│   └── hooks/
│       └── useImagePreloader.ts ← pré-carga assíncrona da sequência
├── netlify.toml
├── next.config.js
├── tailwind.config.ts
└── package.json
```

**Dependências:**
```bash
npm install next@14.2.5 react react-dom framer-motion lenis
npm install -D typescript @types/react @types/node tailwindcss postcss autoprefixer
```

**package.json scripts:**
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

---

## Fase 4 — Sistema de Animação (Canvas Core)

### Regras críticas — aprendidas na prática:

```
❌ NUNCA use cancelAnimationFrame + requestAnimationFrame dentro do handler de scroll
   → O Lenis já dispara uma vez por RAF. Cada novo evento cancela o anterior
     antes de executar: o canvas nunca desenha enquanto o usuário rola.

✅ SEMPRE desenhe diretamente na callback do Lenis
   → lenis.on('scroll', (e) => { drawFrame(images[frameIndex]) })
```

### Hook `useImagePreloader.ts`

```typescript
import { useState, useEffect } from 'react'

export interface PreloaderState {
  images: HTMLImageElement[]
  loaded: boolean
  progress: number  // 0–1
}

export function useImagePreloader(
  frameCount: number,
  getPath: (index: number) => string
): PreloaderState {
  const [state, setState] = useState<PreloaderState>({
    images: [], loaded: false, progress: 0,
  })

  useEffect(() => {
    const imgs: HTMLImageElement[] = new Array(frameCount)
    let doneCount = 0

    for (let i = 0; i < frameCount; i++) {
      const img = new Image()
      img.decoding = 'async'
      imgs[i] = img

      const onSettled = () => {
        doneCount++
        setState({ images: imgs, progress: doneCount / frameCount, loaded: doneCount === frameCount })
      }
      img.onload = onSettled
      img.onerror = onSettled
      img.src = getPath(i)
    }

    setState({ images: imgs, loaded: false, progress: 0 })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return state
}
```

### Componente `HeroScroll.tsx` — Template

```typescript
'use client'

import { useEffect, useRef, useCallback } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { useLenis } from './LenisProvider'
import { useImagePreloader } from '@/hooks/useImagePreloader'

const FRAME_COUNT = 40  // ← ajustar por projeto
const SCROLL_HEIGHT = '400vh'  // ← ajustar: mais vh = mais tempo por frame

function getFramePath(index: number): string {
  const num = String(index + 1).padStart(3, '0')
  return `/sequence-1/ezgif-frame-${num}.jpg`
}

export default function HeroScroll() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const currentFrameRef = useRef(0)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const loadedRef = useRef(false)

  const { lenis } = useLenis()
  const scrollProgress = useMotionValue(0)
  // Overlay UI some entre 15% e 40% do scroll — efeito "entrar na cena"
  const overlayOpacity = useTransform(scrollProgress, [0, 0.15, 0.4], [1, 1, 0])

  const { images, loaded, progress: loadProgress } = useImagePreloader(FRAME_COUNT, getFramePath)

  useEffect(() => {
    imagesRef.current = images
    loadedRef.current = loaded
  }, [images, loaded])

  // Cover-fit: escala a imagem para preencher o canvas sem distorção
  const drawFrame = useCallback((img: HTMLImageElement) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { width: cw, height: ch } = canvas
    const iw = img.naturalWidth
    const ih = img.naturalHeight
    if (!iw || !ih) return

    const scale = Math.max(cw / iw, ch / ih)
    ctx.clearRect(0, 0, cw, ch)
    ctx.drawImage(img,
      (cw - iw * scale) / 2,
      (ch - ih * scale) / 2,
      iw * scale,
      ih * scale
    )
  }, [])

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const img = imagesRef.current[currentFrameRef.current]
    if (img?.complete) drawFrame(img)
  }, [drawFrame])

  // ✅ Desenho direto — sem cancelAnimationFrame aqui
  const handleScroll = useCallback((e: any) => {
    const section = sectionRef.current
    if (!section || !loadedRef.current) return

    const scrollY = typeof e?.scroll === 'number' ? e.scroll : window.scrollY
    const raw = (scrollY - section.offsetTop) / (section.offsetHeight - window.innerHeight)
    const clamped = Math.max(0, Math.min(1, raw))

    scrollProgress.set(clamped)

    const frameIndex = Math.min(FRAME_COUNT - 1, Math.floor(clamped * FRAME_COUNT))
    if (frameIndex === currentFrameRef.current) return
    currentFrameRef.current = frameIndex

    const img = imagesRef.current[frameIndex]
    if (img?.complete) drawFrame(img)
  }, [scrollProgress, drawFrame])

  useEffect(() => {
    if (!lenis) return
    lenis.on('scroll', handleScroll)
    return () => lenis.off('scroll', handleScroll)
  }, [lenis, handleScroll])

  useEffect(() => {
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    return () => window.removeEventListener('resize', resizeCanvas)
  }, [resizeCanvas])

  useEffect(() => {
    if (loaded && images[0]?.complete) { resizeCanvas(); drawFrame(images[0]) }
  }, [loaded, images, drawFrame, resizeCanvas])

  return (
    <section ref={sectionRef} className="relative" style={{ height: SCROLL_HEIGHT }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#05080F]">

        {/* Fallback animado (enquanto frames carregam) */}
        <div className="absolute inset-[-3%] z-0 animate-drift will-change-transform"
          style={{ backgroundImage: 'url(/images/hero-fallback.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
        />

        {/* Canvas scroll-driven */}
        <canvas ref={canvasRef} className="absolute inset-0 z-[1] w-full h-full"
          style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.5s ease' }}
        />

        {/* Loading bar */}
        {!loaded && (
          <div className="absolute bottom-0 left-0 h-[2px] z-20 transition-all duration-300"
            style={{ width: `${loadProgress * 100}%`, background: '#2D6BFF' }}
          />
        )}

        {/* Scrims */}
        <div className="pointer-events-none absolute inset-0 z-[2]"
          style={{ background: 'linear-gradient(180deg, rgba(5,8,15,0.22) 0%, transparent 16%)' }} />
        <div className="pointer-events-none absolute inset-0 z-[2]"
          style={{ background: 'linear-gradient(0deg, rgba(5,8,15,0.38) 0%, transparent 30%)' }} />

        {/* UI Overlay — some no scroll */}
        <motion.div className="absolute inset-0 z-[3]" style={{ opacity: overlayOpacity }}>
          {/* ← Inserir componentes de UI aqui */}
        </motion.div>
      </div>
    </section>
  )
}
```

### Fórmula de mapeamento scroll → frame

```
scrollY        = posição atual do scroll (Lenis)
sectionTop     = section.offsetTop  (geralmente 0)
sectionHeight  = h × 100vh  (ex: 400vh = 4 × windowH)
scrollable     = sectionHeight - windowH

progress       = clamp((scrollY - sectionTop) / scrollable, 0, 1)
frameIndex     = clamp(floor(progress × FRAME_COUNT), 0, FRAME_COUNT - 1)

Pacing: scrollable / FRAME_COUNT = px por frame
  400vh / 40 frames = 10vh/frame ≈ 90px por frame (ritmo cinematográfico)
  300vh / 40 frames = 7.5vh/frame (mais rápido)
  600vh / 40 frames = 15vh/frame (mais contemplativo)
```

---

## Fase 5 — Overlay de UI

### Sistema Glassmorphism (globals.css)

```css
.glass {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(18px) saturate(1.15);
  -webkit-backdrop-filter: blur(18px) saturate(1.15);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.25), 0 14px 40px rgba(0,0,0,0.18);
}

.glass-lite {
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(10px) saturate(1.08);
  -webkit-backdrop-filter: blur(10px) saturate(1.08);
  border: 1px solid rgba(255, 255, 255, 0.10);
}
```

### Animações de entrada (padrão Framer Motion)

```typescript
// Navbar → desce do topo
initial={{ opacity: 0, y: -14 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}

// Card esquerdo → entra da esquerda
initial={{ opacity: 0, x: -40 }}
animate={{ opacity: 1, x: 0 }}
transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.45 }}

// Card direito → entra da direita
initial={{ opacity: 0, x: 40 }}
animate={{ opacity: 1, x: 0 }}
transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.55 }}

// CTA / subblock → sobe do rodapé
initial={{ opacity: 0, y: 16 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.65 }}
```

### Overlay fade no scroll

```typescript
// UI desaparece conforme o usuário "entra" na cena
const scrollProgress = useMotionValue(0)
const overlayOpacity = useTransform(
  scrollProgress,
  [0, 0.15, 0.4],   // pontos de controle
  [1,    1,   0]    // opacidade: visível → visível → invisível
)
// 0–15%: UI totalmente visível (usuário ainda está no estado inicial)
// 15–40%: fade out gradual (usuário está "saltando")
// 40%+: UI completamente invisível (imersão total na queda)
```

---

## Fase 6 — Responsividade

### Princípio: em mobile, a imagem é a UI

```
Mobile  (< 640px):  Canvas full-screen + só CTA. Tudo mais oculto.
Tablet  (640–1024px): Canvas + CTA + card compacto (sem parágrafo)
Desktop (1024px+):  Experiência completa
```

### Padrão de classes por componente

```typescript
// Navbar: links some em < lg, tel some em < sm
<ul className="hidden lg:flex ...">           // links
<div className="hidden xl:flex ...">          // brand mark
<a className="hidden sm:block ...">           // telefone
<div className="sm:hidden w-6" />             // placeholder mobile

// HeroSubblock: some em mobile, parágrafo some em tablet
<div className="hidden sm:block ...">         // card inteiro
<p className="hidden md:block ...">           // parágrafo

// ScrollIndicator: some em tablet/mobile
<div className="hidden md:block ...">         // indicador inteiro
```

---

## Fase 7 — Deploy

### Git + GitHub (via API, sem gh CLI)

```bash
# 1. .gitignore
cat > .gitignore << 'EOF'
node_modules/
/.next/
/out/
.DS_Store
.env
.env*.local
*.tsbuildinfo
next-env.d.ts
EOF

# 2. Inicializar
git init
git config user.name "username"
git config user.email "email@domain.com"
git add .
git commit -m "feat: initial commit"

# 3. Criar repo via API (token do keychain)
GH_TOKEN=$(git credential-osxkeychain get <<< $'protocol=https\nhost=github.com\n' | grep password | cut -d= -f2)
curl -s -X POST \
  -H "Authorization: token $GH_TOKEN" \
  -H "Content-Type: application/json" \
  https://api.github.com/user/repos \
  -d '{"name":"nome-do-repo","private":false}'

# 4. Push
git remote add origin "https://username:${GH_TOKEN}@github.com/username/nome-do-repo.git"
git branch -M main
git push -u origin main
```

### netlify.toml padrão

```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NODE_VERSION = "20"
  NEXT_TELEMETRY_DISABLED = "1"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[[headers]]
  for = "/sequence-1/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/images/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

### Limpar cache Netlify (quando o deploy não atualiza)

```
Netlify Dashboard → Site → Deploys → "Trigger deploy" → "Clear cache and deploy site"
```

> ⚠️ A URL `abc123--site.netlify.app` é um snapshot imutável do deploy específico.
> A URL `site.netlify.app` (sem hash) sempre aponta para o deploy mais recente.

---

## Checklist de Qualidade

### Assets
- [ ] Frames extraídos do vídeo original (não de GIF)
- [ ] Tamanho mínimo: 150KB/frame em 1920×1080
- [ ] Zero-padding nos nomes: `frame-001.jpg`, não `frame-1.jpg`
- [ ] Imagem fallback para loading state

### Performance
- [ ] `drawFrame` NÃO usa `cancelAnimationFrame` interno
- [ ] `useCallback` com deps estáveis em `handleScroll`
- [ ] `useRef` para `images[]` e `loaded` (evita closures stale)
- [ ] Canvas buffer = `window.innerWidth × window.innerHeight`
- [ ] `will-change: transform` na imagem de fallback/drift

### UI
- [ ] Loading bar visível enquanto frames carregam
- [ ] Canvas com `opacity: 0 → 1` após todas as imagens carregarem
- [ ] Overlay com `useTransform` para fade no scroll
- [ ] `backdrop-filter` com prefixo `-webkit-` para Safari
- [ ] Framer Motion entrance animations com delays escalonados

### Responsividade
- [ ] Mobile: só canvas + CTA
- [ ] Navbar não transborda em < 768px
- [ ] Cards de UI com `hidden sm:block` ou similar
- [ ] `font-size: clamp(...)` para textos grandes

### Deploy
- [ ] `.gitignore` inclui `node_modules/`, `.next/`, `.env*`
- [ ] `netlify.toml` com plugin Next.js
- [ ] Cache headers para assets estáticos (sequence-1, images)
- [ ] Testar em `site.netlify.app` (não na URL com hash)

---

## Decisões de Design Padrão

| Elemento | Valor padrão | Nota |
|---|---|---|
| Background | `#05080F` | Quase preto, tom frio |
| Brand accent | `#2D6BFF` | Azul saturado |
| Fonte | Hanken Grotesk | Google Fonts, pesos 400–900 |
| Glass opacity | `rgba(255,255,255,0.08)` | Sutil, não compete com a imagem |
| Glass blur | `blur(18px) saturate(1.15)` | Desktop |
| Glass-lite blur | `blur(10px) saturate(1.08)` | Cards de texto |
| Scroll height | `400vh` | 40 frames → ~9vh/frame |
| Overlay fade | `[0, 0.15, 0.4] → [1, 1, 0]` | Começa a some com 15% de scroll |
| Nav top | `20px` | Mais espaçado em desktop |
| Nav padding | `10px 22px` | Fino, não distrai |

---

## Armadilhas Conhecidas (Lessons Learned)

### 1. `cancelAnimationFrame` no scroll handler
**Problema:** Cancela o draw anterior antes de executar → canvas não atualiza durante scroll ativo.
**Solução:** `drawFrame(img)` direto, sem RAF wrapper.

### 2. Frames extraídos de GIF
**Problema:** GIF = 256 cores → JPEG de GIF = artefatos visíveis. Frames do meio ficam com 30KB em 1920×1080.
**Solução:** Sempre re-extrair com `ffmpeg -q:v 2` do vídeo original.

### 3. Canvas com `width: 100%` CSS sem ajuste do buffer
**Problema:** Canvas buffer ≠ display size → browser escala a imagem → embaçado.
**Solução:** Sempre setar `canvas.width = window.innerWidth` e `canvas.height = window.innerHeight`.

### 4. Lenis com `lenis.off` não desregistra
**Problema:** Callback passado para `lenis.on` deve ser a mesma referência para `lenis.off`.
**Solução:** Usar `useCallback` para estabilizar a referência da callback.

### 5. URL de deploy Netlify não atualiza
**Problema:** URL com hash (`abc123--site.netlify.app`) é snapshot imutável.
**Solução:** Sempre testar em `site.netlify.app` (sem hash).

### 6. Stale closures no scroll handler
**Problema:** `images` e `loaded` do state ficam stale dentro da callback do Lenis.
**Solução:** Manter `imagesRef` e `loadedRef` sincronizados via `useEffect`.

### 7. `@studio-freight/lenis` vs `lenis`
**Problema:** O pacote foi renomeado. `@studio-freight/lenis@1.0.42` é a última versão do nome antigo.
**Solução:** Usar `lenis` (sem escopo) para projetos novos. API idêntica.

---

## Variações e Extensões

### Múltiplas sequências (transições entre seções)
```typescript
// Seção 1: h-[400vh] → sequence-1 (frames 1-40)
// Seção 2: h-[400vh] → sequence-2 (frames 1-40, nova narrativa)
// Usar IntersectionObserver para trocar qual sequência está ativa
```

### Parallax em vez de scrubbing
```typescript
// Em vez de frameIndex, usar translateY baseado no scroll
const y = useTransform(scrollProgress, [0, 1], ['0%', '-20%'])
```

### Vídeo em vez de sequência JPEG
```html
<!-- Para dispositivos de alta performance -->
<video autoPlay muted playsInline loop className="absolute inset-0 object-cover w-full h-full">
  <source src="/video/hero.mp4" type="video/mp4" />
</video>
```

### Audio ambiente (com permissão do usuário)
```typescript
// Tocar áudio ambiente quando scroll > 30%
useEffect(() => {
  if (scrollProgress.get() > 0.3) ambientAudio.play()
}, [])
```
