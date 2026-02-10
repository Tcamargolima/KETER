import { Clock, Heart } from 'lucide-react'
import Card, { CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { Link } from 'react-router-dom'

export default function PracticeCard({ practice, compact = false }) {
  const phaseNames = {
    1: 'Despertar',
    2: 'Disciplina',
    3: 'Consciência',
    4: 'Serviço'
  }

  if (compact) {
    return (
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="primary" size="sm">
                  {phaseNames[practice.fase]}
                </Badge>
                <span className="text-xs text-gray-500">Dia {practice.dia}</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">
                {practice.titulo}
              </h4>
              <p className="text-sm text-gray-600 line-clamp-2">
                {practice.descricao}
              </p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary-600" />
              </div>
              <span className="text-xs text-gray-500">{practice.duracao_minutos}min</span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Icon */}
          <div className="w-full sm:w-24 h-24 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Heart className="w-12 h-12 text-primary-600" />
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="primary">
                {phaseNames[practice.fase]}
              </Badge>
              <span className="text-sm text-gray-500">Dia {practice.dia}</span>
            </div>

            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {practice.titulo}
            </h3>

            <p className="text-gray-600 mb-4">
              {practice.descricao}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{practice.duracao_minutos} minutos</span>
              </div>
              {practice.categoria && (
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  <span>{practice.categoria}</span>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Link to={`/app/practices/${practice.id}`}>
                <Button>Iniciar Prática</Button>
              </Link>
              <Button variant="outline">Ver Detalhes</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
