import { AuthProvider } from '@/context/AuthContext'
import AppRoutes from '@/routes'
import Toaster from '@/components/common/Toaster'

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <Toaster />
    </AuthProvider>
  )
}
