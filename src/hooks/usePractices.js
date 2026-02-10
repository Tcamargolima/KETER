import { useState, useEffect } from 'react'
import { practicesService } from '@/services/practicesService'
import { useAuth } from '@/context/AuthContext'

export function usePractices() {
  const { user } = useAuth()
  const [dailyPractice, setDailyPractice] = useState(null)
  const [allPractices, setAllPractices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (user) {
      loadDailyPractice()
    }
  }, [user])

  const loadDailyPractice = async () => {
    setLoading(true)
    const { data, error } = await practicesService.getDailyPractice(user.id)
    if (error) {
      setError(error)
    } else {
      setDailyPractice(data)
    }
    setLoading(false)
  }

  const loadAllPractices = async () => {
    const { data, error } = await practicesService.getAllPractices()
    if (error) {
      setError(error)
    } else {
      setAllPractices(data)
    }
  }

  const completePractice = async (practiceId, duration, notes) => {
    const { data, error } = await practicesService.completePractice(
      user.id,
      practiceId,
      duration,
      notes
    )
    
    if (!error) {
      // Recarregar prática diária
      await loadDailyPractice()
    }
    
    return { data, error }
  }

  return {
    dailyPractice,
    allPractices,
    loading,
    error,
    loadAllPractices,
    completePractice,
    refreshDailyPractice: loadDailyPractice
  }
}
