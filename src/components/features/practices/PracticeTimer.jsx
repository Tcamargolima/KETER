import { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function PracticeTimer({ 
  duration = 180, // duração em segundos
  onComplete 
}) {
  const [timeLeft, setTimeLeft] = useState(duration)
  const [isRunning, setIsRunning] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const intervalRef = useRef(null)

  // Timer countdown
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false)
            setIsCompleted(true)
            if (onComplete) onComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, timeLeft, onComplete])

  const toggleTimer = () => {
    setIsRunning(!isRunning)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setTimeLeft(duration)
    setIsCompleted(false)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Calcular progresso (0 a 1)
  const progress = 1 - (timeLeft / duration)
  const strokeDashoffset = 440 - (440 * progress) // 440 é a circunferência

  return (
    <div className="flex flex-col items-center gap-8">
      {/* SVG Timer Circle */}
      <div className="relative">
        <svg width="200" height="200" className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r="70"
            stroke="#e5e7eb"
            strokeWidth="8"
            fill="none"
          />
          
          {/* Progress circle */}
          <circle
            cx="100"
            cy="100"
            r="70"
            stroke="url(#gradient)"
            strokeWidth="8"
            fill="none"
            strokeDasharray="440"
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-linear"
          />
          
          {/* Gradient */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#d946ef" />
            </linearGradient>
          </defs>
        </svg>

        {/* Time display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900">
              {formatTime(timeLeft)}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {isCompleted ? 'Completo!' : isRunning ? 'Em andamento' : 'Pausado'}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <Button
          size="lg"
          onClick={toggleTimer}
          disabled={isCompleted}
        >
          {isRunning ? (
            <>
              <Pause className="w-5 h-5 mr-2" />
              Pausar
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-2" />
              Iniciar
            </>
          )}
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={resetTimer}
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Reiniciar
        </Button>
      </div>

      {/* Completion message */}
      {isCompleted && (
        <div className="text-center animate-fadeIn">
          <p className="text-lg font-semibold text-primary-600">
            Parabéns! Você completou a prática! 🎉
          </p>
        </div>
      )}
    </div>
  )
}
