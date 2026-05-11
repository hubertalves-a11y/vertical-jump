import { useState, useEffect } from 'react'

export interface PreloaderState {
  images: HTMLImageElement[]
  loaded: boolean
  progress: number
}

// Loads `priorityCount` frames first, marks loaded=true, then continues with the rest in background.
export function useImagePreloader(
  frameCount: number,
  getPath: (index: number) => string,
  priorityCount = 20
): PreloaderState {
  const [state, setState] = useState<PreloaderState>({
    images: [],
    loaded: false,
    progress: 0,
  })

  useEffect(() => {
    const imgs: HTMLImageElement[] = new Array(frameCount)
    let priorityDone = 0
    let totalDone = 0

    function loadRest() {
      for (let i = priorityCount; i < frameCount; i++) {
        const img = new Image()
        img.decoding = 'async'
        imgs[i] = img
        img.onload = img.onerror = () => {
          totalDone++
          setState(prev => ({ ...prev, images: imgs, progress: totalDone / frameCount }))
        }
        img.src = getPath(i)
      }
    }

    for (let i = 0; i < priorityCount; i++) {
      const img = new Image()
      img.decoding = 'async'
      imgs[i] = img
      img.onload = img.onerror = () => {
        priorityDone++
        totalDone++
        const ready = priorityDone >= priorityCount
        setState({ images: imgs, loaded: ready, progress: totalDone / frameCount })
        if (ready) loadRest()
      }
      img.src = getPath(i)
    }

    setState({ images: imgs, loaded: false, progress: 0 })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return state
}
