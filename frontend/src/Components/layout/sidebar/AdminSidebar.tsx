import { Link, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/store/typedHooks'
import {
  LayoutDashboard,
  User,
  Users,
  Package,
  ClipboardCheck,
  PenSquare,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const AdminSidebar = () => {
  const location = useLocation()
  const { user } = useAppSelector((state) => state.user)
  const [mobileOpen, setMobileOpen] = useState(false)

  const links = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Stats Overview' },
    { to: '/admin/dashboard/profile', icon: User, label: 'Profile' },
    { to: '/admin/dashboard/users', icon: Users, label: 'All Users' },
    { to: '/admin/dashboard/products', icon: Package, label: 'All Products' },
    { to: '/admin/dashboard/approvals', icon: ClipboardCheck, label: 'Approvals' },
    { to: '/admin/dashboard/features', icon: PenSquare, label: 'Edit Features' },
    { to: '/admin/dashboard/settings', icon: Settings, label: 'Settings' },
  ]

  const isActive = (path: string) => {
    if (path === '/admin/dashboard') return location.pathname === '/admin/dashboard'
    return location.pathname.startsWith(path)
  }

  const handleNavClick = () => {
    setMobileOpen(false)
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Admin info */}
      <div className="p-4 border-b border-neutral-200">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="h-10 w-10 rounded-full bg-danger-100 flex items-center justify-center">
              {user?.avatar ? (
                <img src={user.avatar.url} alt={user.name} className="h-10 w-10 rounded-full object-cover" />
              ) : (
                <Shield className="h-5 w-5 text-danger-600" />
              )}
            </div>
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-success-500 border-2 border-white" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-neutral-900 truncate">{user?.name}</p>
            <p className="text-xs text-danger-600 font-medium capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {links.map((link) => {
          const Icon = link.icon
          const active = isActive(link.to)
          return (
            <Link
              key={link.to}
              to={link.to}
              onClick={handleNavClick}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                active
                  ? 'bg-danger-50 text-danger-700'
                  : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
              )}
            >
              <Icon className={cn('h-4 w-4', active ? 'text-danger-600' : 'text-neutral-400')} />
              {link.label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-neutral-200">
        <Link
          to="/logout"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-600 hover:bg-danger-50 hover:text-danger-600 transition-colors"
        >
          <LogOut className="h-4 w-4 text-neutral-400" />
          Logout
        </Link>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button
        type="button"
        className="lg:hidden fixed top-20 left-3 z-40 h-10 w-10 rounded-lg bg-white border border-neutral-200 shadow-sm flex items-center justify-center"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          'lg:hidden fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-neutral-200 transition-transform duration-200',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 border-r border-neutral-200 bg-white min-h-[calc(100vh-64px)]">
        {sidebarContent}
      </aside>
    </>
  )
}

export default AdminSidebar
