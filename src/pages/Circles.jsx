import { Link } from 'react-router-dom'
import { Users, MessageCircle, Calendar } from 'lucide-react'

export default function Circles() {
  const circles = [
    {
      id: 1,
      name: 'Mindfulness Diário',
      description: 'Grupo para praticar mindfulness todos os dias',
      members: 24,
      lastActivity: '2h atrás',
      colorBg: 'bg-purple-100',
      colorIcon: 'text-purple-600'
    },
    {
      id: 2,
      name: 'Crescimento Pessoal',
      description: 'Compartilhe sua jornada de desenvolvimento',
      members: 18,
      lastActivity: '1 dia atrás',
      colorBg: 'bg-amber-100',
      colorIcon: 'text-amber-600'
    },
    {
      id: 3,
      name: 'Meditação Avançada',
      description: 'Para praticantes com experiência',
      members: 12,
      lastActivity: '3h atrás',
      colorBg: 'bg-blue-100',
      colorIcon: 'text-blue-600'
    },
  ]

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Círculos de Apoio</h1>
          <p className="text-gray-600 mt-2">
            Conecte-se com pessoas em jornadas similares
          </p>
        </div>
        <button className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors">
          Criar Círculo
        </button>
      </div>

      <div className="grid gap-6">
        {circles.map((circle) => (
          <Link
            key={circle.id}
            to={`/app/circles/${circle.id}`}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 ${circle.colorBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <Users className={`w-6 h-6 ${circle.colorIcon}`} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {circle.name}
                </h3>
                <p className="text-gray-600 mb-3">{circle.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {circle.members} membros
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    Ativo {circle.lastActivity}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
