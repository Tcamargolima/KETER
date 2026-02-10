import { X, Download } from 'lucide-react'
import { useState } from 'react'
import Button from '@/components/ui/Button'
import { useInstallPrompt } from '@/hooks/useInstallPrompt'

export default function InstallPrompt() {
  const { canInstall, isInstalled, promptInstall } = useInstallPrompt()
  const [dismissed, setDismissed] = useState(false)

  if (isInstalled || dismissed || !canInstall) return null

  const handleInstall = async () => {
    const success = await promptInstall()
    if (success) {
      setDismissed(true)
    }
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 animate-slideUp">
      <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
        <button
          onClick={() => setDismissed(true)}
          className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>

        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Download className="w-6 h-6 text-primary-600" />
          </div>

          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">
              Instalar KETER
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Acesso rápido e funciona offline
            </p>
            <Button onClick={handleInstall} size="sm" className="w-full">
              Instalar App
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
