import { Link } from 'react-router-dom'
import { Heart, Clock, Award } from 'lucide-react'

export default function Practices() {
  const practices = [
    {
      id: 1,
      title: 'Meditação da Respiração',
      description: 'Pratique a consciência da respiração',
      duration: '10 min',
      difficulty: 'Iniciante',
      completed: false
    },
    {
      id: 2,
      title: 'Escaneamento Corporal',
      description: 'Conecte-se com as sensações do corpo',
      duration: '15 min',
      difficulty: 'Iniciante',
      completed: true
    },
    {
      id: 3,
      title: 'Meditação Caminhando',
      description: 'Mindfulness em movimento',
      duration: '20 min',
      difficulty: 'Intermediário',
      completed: false
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Práticas</h1>
        <p className="text-gray-600 mt-2">
          Explore práticas de mindfulness e autoconhecimento
        </p>
      </div>

      <div className="grid gap-6">
        {practices.map((practice) => (
          <Link
            key={practice.id}
            to={`/app/practices/${practice.id}`}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Heart className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {practice.title}
                    </h3>
                    {practice.completed && (
                      <span className="inline-flex items-center gap-1 text-xs text-green-600">
                        <Award className="w-3 h-3" />
                        Completa
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-gray-600 mb-3">{practice.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {practice.duration}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                    {practice.difficulty}
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
