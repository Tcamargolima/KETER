import { Menu, Bell, Search } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export default function Header({ onMenuClick }) {
  const { profile } = useAuth()

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search (desktop) */}
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar práticas..."
            className="bg-transparent border-none outline-none text-sm"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 hover:bg-gray-100 rounded-lg">
          <Bell className="w-5 h-5 text-gray-700" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Profile (mobile) */}
        <div className="md:hidden w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
          <span className="text-primary-600 font-semibold text-sm">
            {profile?.nome?.charAt(0) || 'U'}
          </span>
        </div>
      </div>
    </header>
  )
}
