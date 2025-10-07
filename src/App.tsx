import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ReportDetail from './pages/ReportDetail'
import Upload from './pages/Upload'
import Comparison from './pages/Comparison'

function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      setUser(JSON.parse(userStr))
    }
  }, [location])

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  if (location.pathname === '/login') {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-8">
              <div className="cursor-pointer" onClick={() => navigate('/')}>
                <h1 className="text-2xl font-bold text-gray-900">
                  Bid Intelligence Platform
                </h1>
                <p className="text-sm text-gray-500">Construction Tender Analysis</p>
              </div>
              <nav className="hidden md:flex gap-6">
                <button
                  onClick={() => navigate('/')}
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === '/' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => navigate('/upload')}
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === '/upload' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Upload
                </button>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              {user && (
                <div className="hidden sm:block text-sm text-gray-600">
                  {user.full_name || user.email}
                </div>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            Construction Bid Intelligence Platform - Powered by AI
          </p>
        </div>
      </footer>
    </div>
  )
}

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('auth_token')
  return token ? <>{children}</> : <Navigate to="/login" />
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <PrivateRoute>
                <Upload />
              </PrivateRoute>
            }
          />
          <Route
            path="/report/:id"
            element={
              <PrivateRoute>
                <ReportDetail />
              </PrivateRoute>
            }
          />
          <Route
            path="/compare"
            element={
              <PrivateRoute>
                <Comparison />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
