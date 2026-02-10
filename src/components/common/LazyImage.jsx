import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

export default function LazyImage({ 
  src, 
  alt, 
  className,
  placeholder = '/placeholder.webp'
}) {
  const [imageSrc, setImageSrc] = useState(placeholder)
  const [isLoaded, setIsLoaded] = useState(false)
  const imgRef = useRef(null)

  useEffect(() => {
    let observer
    const currentImg = imgRef.current
    
    if (currentImg) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setImageSrc(src)
              observer.unobserve(entry.target)
            }
          })
        },
        { rootMargin: '50px' }
      )
      
      observer.observe(currentImg)
    }
    
    return () => {
      if (observer && currentImg) {
        observer.unobserve(currentImg)
      }
    }
  }, [src])

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      className={cn(
        'transition-opacity duration-300',
        isLoaded ? 'opacity-100' : 'opacity-50',
        className
      )}
      onLoad={() => setIsLoaded(true)}
    />
  )
}
