import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { CheckCircle } from 'lucide-react'

export default function Onboarding() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    objetivos: [],
    experiencia: '',
    disponibilidade: ''
  })
  const { updateProfile } = useAuth()
  const navigate = useNavigate()

  const handleComplete = async () => {
    await updateProfile({
      onboarding_completed: true,
      ...formData
    })
    navigate('/app/dashboard', { replace: true })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-amber-50 to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gradient mb-2">KETER</h1>
          <h2 className="text-2xl font-semibold text-gray-900">Bem-vindo!</h2>
          <p className="text-gray-600 mt-2">
            Vamos personalizar sua experiência
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Progress */}
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`flex-1 h-2 rounded-full mx-1 ${
                  s <= step ? 'bg-purple-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {step === 1 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">
                Quais são seus objetivos?
              </h3>
              <p className="text-gray-600 mb-6">
                Selecione o que você deseja desenvolver
              </p>
              {/* Add objectives selection here */}
              <button
                onClick={() => setStep(2)}
                className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
              >
                Continuar
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">
                Qual sua experiência com mindfulness?
              </h3>
              <p className="text-gray-600 mb-6">
                Isso nos ajuda a personalizar seu conteúdo
              </p>
              {/* Add experience selection here */}
              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Voltar
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Tudo pronto!
                </h3>
                <p className="text-gray-600 mb-6">
                  Sua jornada de autoconhecimento começa agora
                </p>
              </div>
              <button
                onClick={handleComplete}
                className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
              >
                Começar Jornada
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
