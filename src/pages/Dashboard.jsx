import { useAuth } from '@/context/AuthContext'
import { Heart, TrendingUp, Users, Calendar } from 'lucide-react'

export default function Dashboard() {
  const { profile } = useAuth()

  const stats = [
    { label: 'Práticas Completas', value: '12', icon: Heart, colorBg: 'bg-purple-100', colorText: 'text-purple-600' },
    { label: 'Dias de Sequência', value: '7', icon: TrendingUp, colorBg: 'bg-amber-100', colorText: 'text-amber-600' },
    { label: 'Círculos Ativos', value: '3', icon: Users, colorBg: 'bg-blue-100', colorText: 'text-blue-600' },
    { label: 'Fase Atual', value: profile?.fase_atual || '1', icon: Calendar, colorBg: 'bg-green-100', colorText: 'text-green-600' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Olá, {profile?.nome || 'Usuário'}! 👋
        </h1>
        <p className="text-gray-600 mt-2">
          Bem-vindo ao seu painel de crescimento pessoal
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.colorBg} rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.colorText}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Atividades Recentes</h2>
        <div className="space-y-4">
          <p className="text-gray-600">Nenhuma atividade recente.</p>
        </div>
      </div>
    </div>
  )
}
