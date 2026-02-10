import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { lazy, Suspense } from 'react'

// Layouts
import AppLayout from '@/components/layout/AppLayout'
import PublicLayout from '@/components/layout/PublicLayout'

// Guards
import ProtectedRoute from './ProtectedRoute'
import PublicRoute from './PublicRoute'
import OnboardingRoute from './OnboardingRoute'

// Loading component
import LoadingSpinner from '@/components/common/LoadingSpinner'

// Lazy load pages
const Landing = lazy(() => import('@/pages/Landing'))
const Login = lazy(() => import('@/pages/Login'))
const Signup = lazy(() => import('@/pages/Signup'))
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword'))
const Onboarding = lazy(() => import('@/pages/Onboarding'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const Practices = lazy(() => import('@/pages/Practices'))
const PracticeDetail = lazy(() => import('@/pages/PracticeDetail'))
const Circles = lazy(() => import('@/pages/Circles'))
const CircleDetail = lazy(() => import('@/pages/CircleDetail'))
const Profile = lazy(() => import('@/pages/Profile'))
const Settings = lazy(() => import('@/pages/Settings'))
const TestUI = lazy(() => import('@/pages/TestUI'))
const NotFound = lazy(() => import('@/pages/NotFound'))

// Wrapper para suspense
const SuspenseWrapper = ({ children }) => (
  <Suspense fallback={
    <div className="flex items-center justify-center min-h-screen">
      <LoadingSpinner />
    </div>
  }>
    {children}
  </Suspense>
)

const router = createBrowserRouter([
  // Rotas Públicas
  {
    element: <PublicLayout />,
    children: [
      {
        path: '/',
        element: (
          <PublicRoute>
            <SuspenseWrapper>
              <Landing />
            </SuspenseWrapper>
          </PublicRoute>
        )
      },
      {
        path: '/login',
        element: (
          <PublicRoute>
            <SuspenseWrapper>
              <Login />
            </SuspenseWrapper>
          </PublicRoute>
        )
      },
      {
        path: '/signup',
        element: (
          <PublicRoute>
            <SuspenseWrapper>
              <Signup />
            </SuspenseWrapper>
          </PublicRoute>
        )
      },
      {
        path: '/forgot-password',
        element: (
          <PublicRoute>
            <SuspenseWrapper>
              <ForgotPassword />
            </SuspenseWrapper>
          </PublicRoute>
        )
      }
    ]
  },

  // Onboarding (semi-protegido)
  {
    path: '/onboarding',
    element: (
      <OnboardingRoute>
        <SuspenseWrapper>
          <Onboarding />
        </SuspenseWrapper>
      </OnboardingRoute>
    )
  },

  // Rotas Protegidas (App)
  {
    path: '/app',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: (
          <SuspenseWrapper>
            <Dashboard />
          </SuspenseWrapper>
        )
      },
      {
        path: 'practices',
        element: (
          <SuspenseWrapper>
            <Practices />
          </SuspenseWrapper>
        )
      },
      {
        path: 'practices/:id',
        element: (
          <SuspenseWrapper>
            <PracticeDetail />
          </SuspenseWrapper>
        )
      },
      {
        path: 'circles',
        element: (
          <SuspenseWrapper>
            <Circles />
          </SuspenseWrapper>
        )
      },
      {
        path: 'circles/:id',
        element: (
          <SuspenseWrapper>
            <CircleDetail />
          </SuspenseWrapper>
        )
      },
      {
        path: 'profile',
        element: (
          <SuspenseWrapper>
            <Profile />
          </SuspenseWrapper>
        )
      },
      {
        path: 'settings',
        element: (
          <SuspenseWrapper>
            <Settings />
          </SuspenseWrapper>
        )
      },
      {
        path: 'test-ui',
        element: (
          <SuspenseWrapper>
            <TestUI />
          </SuspenseWrapper>
        )
      }
    ]
  },

  // 404
  {
    path: '*',
    element: (
      <SuspenseWrapper>
        <NotFound />
      </SuspenseWrapper>
    )
  }
])

export default function AppRoutes() {
  return <RouterProvider router={router} />
}
