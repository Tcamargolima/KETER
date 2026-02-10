import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Users, Send } from 'lucide-react'
import { useState } from 'react'

export default function CircleDetail() {
  const { id } = useParams()
  const [message, setMessage] = useState('')

  const circle = {
    id,
    name: 'Mindfulness Diário',
    description: 'Grupo para praticar mindfulness todos os dias',
    members: 24,
    messages: [
      {
        id: 1,
        user: 'Ana Silva',
        message: 'Bom dia! Acabei de fazer minha meditação matinal 🧘‍♀️',
        time: '8:30'
      },
      {
        id: 2,
        user: 'João Pedro',
        message: 'Que ótimo, Ana! Também comecei meu dia com 10 minutos de respiração consciente',
        time: '8:45'
      },
      {
        id: 3,
        user: 'Maria Costa',
        message: 'Alguém tem dicas para lidar com pensamentos intrusivos durante a meditação?',
        time: '9:15'
      },
    ]
  }

  return (
    <div>
      <Link
        to="/app/circles"
        className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para círculos
      </Link>

      <div className="bg-white rounded-xl shadow-sm">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center">
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{circle.name}</h1>
              <p className="text-gray-600 mt-1">{circle.description}</p>
              <p className="text-sm text-gray-500 mt-2">{circle.members} membros</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
          {circle.messages.map((msg) => (
            <div key={msg.id} className="flex gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 font-semibold text-sm">
                  {msg.user.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm">{msg.user}</span>
                  <span className="text-xs text-gray-500">{msg.time}</span>
                </div>
                <p className="text-gray-700">{msg.message}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex gap-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
              <Send className="w-5 h-5" />
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
