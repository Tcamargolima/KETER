import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Heart, Users } from 'lucide-react'

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-amber-50 to-purple-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <nav className="flex justify-between items-center mb-16">
          <h1 className="text-3xl font-bold text-gradient">KETER</h1>
          <div className="flex gap-4">
            <Link
              to="/login"
              className="px-6 py-2 text-purple-600 hover:text-purple-700 font-medium"
            >
              Entrar
            </Link>
            <Link
              to="/signup"
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Começar
            </Link>
          </div>
        </nav>

        {/* Hero */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Transforme sua vida através da{' '}
            <span className="text-gradient">autoconsciência</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Uma jornada estruturada de autoconhecimento e crescimento pessoal
            baseada em práticas científicas e mindfulness.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-purple-600 text-white text-lg rounded-lg hover:bg-purple-700 transition-colors"
          >
            Iniciar Jornada
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Método Estruturado</h3>
            <p className="text-gray-600">
              Sistema de 5 fases progressivas para desenvolvimento contínuo.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
              <Heart className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Práticas Diárias</h3>
            <p className="text-gray-600">
              Exercícios práticos de mindfulness e autoconhecimento.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Círculos de Apoio</h3>
            <p className="text-gray-600">
              Compartilhe sua jornada com uma comunidade de apoio.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
