import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import LoadingSpinner from '@/components/common/LoadingSpinner'

export default function PublicRoute({ children }) {
  const { isAuthenticated, isOnboarded, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  // Se já está autenticado
  if (isAuthenticated) {
    // Se ainda não completou onboarding
    if (!isOnboarded) {
      return <Navigate to="/onboarding" replace />
    }
    // Senão, vai pro dashboard
    return <Navigate to="/app/dashboard" replace />
  }

  return children
}
