import { Link } from 'react-router-dom'
import { Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-amber-50 to-purple-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gradient">404</h1>
          <h2 className="text-3xl font-semibold text-gray-900 mt-4">
            Página não encontrada
          </h2>
          <p className="text-gray-600 mt-4">
            Ops! A página que você está procurando não existe ou foi movida.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/app/dashboard"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Home className="w-5 h-5" />
            Ir para Dashboard
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-purple-600 text-purple-600 font-semibold rounded-lg hover:bg-purple-50 transition-colors"
          >
            Página Inicial
          </Link>
        </div>

        <div className="mt-12">
          <div className="w-64 h-64 mx-auto bg-purple-100 rounded-full flex items-center justify-center opacity-50">
            <Search className="w-32 h-32 text-purple-400" />
          </div>
        </div>
      </div>
    </div>
  )
}
