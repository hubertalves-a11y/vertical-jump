import { useState, useEffect } from 'react'

export interface PreloaderState {
  images: HTMLImageElement[]
  loaded: boolean
  progress: number
}

export function useImagePreloader(
  frameCount: number,
  getPath: (index: number) => string
): PreloaderState {
  const [state, setState] = useState<PreloaderState>({
    images: [],
    loaded: false,
    progress: 0,
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
        const done = doneCount === frameCount
        setState({
          images: imgs,
          progress: doneCount / frameCount,
          loaded: done,
        })
      }

      img.onload = onSettled
      img.onerror = onSettled
      img.src = getPath(i)
    }

    // Expose the array immediately so HeroScroll can access imgs[0] as it loads
    setState({ images: imgs, loaded: false, progress: 0 })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return state
}
