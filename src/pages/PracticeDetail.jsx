import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Play, Heart, Clock } from 'lucide-react'

export default function PracticeDetail() {
  const { id } = useParams()

  const practice = {
    id,
    title: 'Meditação da Respiração',
    description: 'Pratique a consciência da respiração e desenvolva atenção plena',
    duration: '10 min',
    difficulty: 'Iniciante',
    instructions: [
      'Encontre uma posição confortável',
      'Feche os olhos suavemente',
      'Direcione sua atenção para a respiração',
      'Observe o ar entrando e saindo',
      'Quando a mente divagar, gentilmente retorne ao foco',
    ],
    benefits: [
      'Reduz estresse e ansiedade',
      'Melhora concentração',
      'Aumenta autoconsciência',
      'Promove bem-estar emocional',
    ]
  }

  return (
    <div>
      <Link
        to="/app/practices"
        className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar para práticas
      </Link>

      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center">
              <Heart className="w-8 h-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{practice.title}</h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {practice.duration}
                </span>
                <span className="px-2 py-1 bg-gray-100 rounded">
                  {practice.difficulty}
                </span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-gray-700 mb-8">{practice.description}</p>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Instruções</h2>
          <ol className="space-y-3">
            {practice.instructions.map((instruction, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </span>
                <span className="text-gray-700">{instruction}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Benefícios</h2>
          <ul className="space-y-2">
            {practice.benefits.map((benefit, index) => (
              <li key={index} className="flex items-center gap-2 text-gray-700">
                <div className="w-1.5 h-1.5 bg-purple-600 rounded-full" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        <button className="w-full py-4 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
          <Play className="w-5 h-5" />
          Iniciar Prática
        </button>
      </div>
    </div>
  )
}
