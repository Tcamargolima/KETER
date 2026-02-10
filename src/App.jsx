import { AuthProvider } from '@/context/AuthContext'
import AppRoutes from '@/routes'
import Toaster from '@/components/common/Toaster'
import InstallPrompt from '@/components/common/InstallPrompt'

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <Toaster />
      <InstallPrompt />
    </AuthProvider>
  )
}
