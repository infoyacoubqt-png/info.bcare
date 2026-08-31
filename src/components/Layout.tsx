import { Outlet, Link, useLocation } from 'react-router-dom'

export default function Layout() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <header className={`sticky top-0 z-50 transition-all duration-300 ${isHome ? 'bg-transparent' : 'bg-white shadow-sm'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center text-white font-extrabold text-lg shadow-md group-hover:scale-105 transition-transform">
              B
            </div>
            <span className={`font-extrabold text-xl ${isHome ? 'text-white' : 'text-primary-700'}`}>
              BeCare
            </span>
          </Link>
          <nav className="flex items-center gap-4 sm:gap-6 text-sm font-bold">
            <Link to="/" className={`${isHome ? 'text-white/90 hover:text-white' : 'text-neutral-600 hover:text-primary-600'} transition-colors`}>
              الرئيسية
            </Link>
            <Link to="/vehicle-form" className={`${isHome ? 'text-white/90 hover:text-white' : 'text-neutral-600 hover:text-primary-600'} transition-colors`}>
              تأمين سيارتك
            </Link>
            <Link to="/privacy" className={`${isHome ? 'text-white/90 hover:text-white' : 'text-neutral-600 hover:text-primary-600'} transition-colors`}>
              الخصوصية
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-neutral-900 text-neutral-400 py-8 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold text-sm">
                B
              </div>
              <span className="font-bold text-white">BeCare</span>
            </div>
            <div className="flex gap-6 text-sm">
              <Link to="/privacy" className="hover:text-white transition-colors">الخصوصية</Link>
              <Link to="/terms" className="hover:text-white transition-colors">الشروط</Link>
              <Link to="/cookies" className="hover:text-white transition-colors">الكوكيز</Link>
            </div>
            <p className="text-xs text-neutral-500">© 2026 BeCare - جميع الحقوق محفوظة</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
