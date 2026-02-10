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
    
    if (imgRef.current) {
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
      
      observer.observe(imgRef.current)
    }
    
    return () => {
      if (observer && imgRef.current) {
        observer.unobserve(imgRef.current)
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
