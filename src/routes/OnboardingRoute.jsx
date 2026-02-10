import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import LoadingSpinner from '@/components/common/LoadingSpinner'

export default function OnboardingRoute({ children }) {
  const { isAuthenticated, isOnboarded, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  // Precisa estar autenticado para fazer onboarding
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Se já completou onboarding, vai pro app
  if (isOnboarded) {
    return <Navigate to="/app/dashboard" replace />
  }

  return children
}
