import { useAuth } from '@/context/AuthContext'
import { User, Mail, Calendar, Award } from 'lucide-react'

export default function Profile() {
  const { profile, user } = useAuth()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Perfil</h1>
        <p className="text-gray-600 mt-2">Gerencie suas informações pessoais</p>
      </div>

      <div className="grid gap-6">
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 font-bold text-3xl">
                {profile?.nome?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">
                {profile?.nome || 'Usuário'}
              </h2>
              <p className="text-gray-600 mt-1 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {user?.email}
              </p>
              <div className="mt-4 flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  Membro desde {new Date().toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1 text-gray-600">
                  <Award className="w-4 h-4" />
                  Fase {profile?.fase_atual || 1}
                </span>
              </div>
            </div>
            <button className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors">
              Editar Perfil
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-4">Estatísticas</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">12</p>
              <p className="text-sm text-gray-600">Práticas</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-amber-600">7</p>
              <p className="text-sm text-gray-600">Dias seguidos</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">3</p>
              <p className="text-sm text-gray-600">Círculos</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">85%</p>
              <p className="text-sm text-gray-600">Conclusão</p>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-4">Conquistas</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border-2 border-dashed border-gray-300 rounded-lg">
              <Award className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Primeira Prática</p>
            </div>
            <div className="text-center p-4 border-2 border-dashed border-gray-300 rounded-lg">
              <Award className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">7 Dias</p>
            </div>
            <div className="text-center p-4 border-2 border-dashed border-gray-300 rounded-lg opacity-50">
              <Award className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">30 Dias</p>
            </div>
            <div className="text-center p-4 border-2 border-dashed border-gray-300 rounded-lg opacity-50">
              <Award className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Fase 2</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
