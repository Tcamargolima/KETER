import { AuthProvider } from '@/context/AuthContext'
import AppRoutes from '@/routes'
import Toaster from '@/components/common/Toaster'
import ErrorBoundary from '@/components/common/ErrorBoundary'

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppRoutes />
        <Toaster />
      </AuthProvider>
    </ErrorBoundary>
  )
}
