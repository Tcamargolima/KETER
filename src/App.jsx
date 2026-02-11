import { AuthProvider } from '@/context/AuthContext'
import AppRoutes from '@/routes'
import Toaster from '@/components/common/Toaster'
import InstallPrompt from '@/components/common/InstallPrompt'

// Register Service Worker
if ('serviceWorker' in navigator && !import.meta.env.DEV) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('SW registered: ', registration);
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <Toaster />
      <InstallPrompt />
    </AuthProvider>
  )
}
