import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { Heart, Trophy, TrendingUp, Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const { profile } = useAuth()
  const [stats, setStats] = useState({
    streak: 0,
    totalPractices: 0,
    weekProgress: 0,
    phase: 1
  })

  useEffect(() => {
    // Carregar estatísticas do usuário
    loadUserStats()
  }, [])

  const loadUserStats = async () => {
    // TODO: Implementar query ao Supabase
    setStats({
      streak: 7,
      totalPractices: 23,
      weekProgress: 5,
      phase: profile?.fase_atual || 1
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Olá, {profile?.nome || 'Usuário'} 👋
        </h1>
        <p className="text-gray-600 mt-1">
          Bem-vindo de volta à sua jornada de evolução
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Streak */}
        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Sequência</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.streak} dias
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <Trophy className="w-6 h-6 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        {/* Total Practices */}
        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Práticas</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.totalPractices}
              </p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-primary-600" />
            </div>
          </CardContent>
        </Card>

        {/* Week Progress */}
        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Esta Semana</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.weekProgress}/7
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        {/* Phase */}
        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Fase Atual</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                Fase {stats.phase}
              </p>
            </div>
            <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6 text-secondary-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Practice of the Day */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Prática de Hoje</CardTitle>
            <Badge variant="primary">Despertar</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-2">
                Respiração Consciente
              </h4>
              <p className="text-gray-600 text-sm mb-4">
                3 minutos de respiração profunda para iniciar seu dia com presença e intenção.
              </p>
              <div className="flex gap-2">
                <Link to="/app/practices/1">
                  <Button>Começar Prática</Button>
                </Link>
                <Button variant="outline">Ver Detalhes</Button>
              </div>
            </div>
            <div className="w-full sm:w-32 h-32 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center">
              <Heart className="w-16 h-16 text-primary-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Evolução Semanal</CardTitle>
          </CardHeader>
          <CardContent>
            {/* TODO: Adicionar gráfico com Recharts */}
            <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Gráfico em breve...</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Seu Círculo</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 text-sm mb-4">
              Conecte-se com pessoas em jornadas similares
            </p>
            <Link to="/app/circles">
              <Button variant="outline" className="w-full">
                Explorar Círculos
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
