import { Button } from '@/components/ui/button'
import { useAppSelector } from '@/store/typedHooks'
import { LayoutDashboard, LogIn, LogOut, MessageSquare, Shield } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import NotificationDropdown from './NotificationDropdown'

const socialLinks = [
  { href: 'https://www.facebook.com', icon: 'fa-brands fa-facebook-f', label: 'Facebook' },
  { href: 'https://www.twitter.com', icon: 'fa-brands fa-twitter', label: 'Twitter' },
  { href: 'https://www.linkedin.com', icon: 'fa-brands fa-linkedin-in', label: 'LinkedIn' },
  { href: 'https://myaccount.google.com', icon: 'fa-brands fa-google-plus-g', label: 'Google' },
]

const TopBar = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.user)

  return (
    <div className="bg-neutral-50 border-b border-neutral-200 text-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-8">
          {/* Social Links */}
          <div className="hidden sm:flex items-center gap-3">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-500 hover:text-primary-500 transition-colors"
                aria-label={link.label}
              >
                <i className={`${link.icon} text-xs`} />
              </a>
            ))}
          </div>

          {/* Auth / User Links */}
          <div className="flex items-center gap-1 ml-auto">
            {!isAuthenticated ? (
              <>
                <NavLink to="/Signup">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs gap-1 text-neutral-600 hover:text-neutral-900"
                  >
                    <LogIn className="h-3 w-3" />
                    <span>Register</span>
                  </Button>
                </NavLink>
                <NavLink to="/Login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs gap-1 text-neutral-600 hover:text-neutral-900"
                  >
                    <LogIn className="h-3 w-3" />
                    <span>Login</span>
                  </Button>
                </NavLink>
              </>
            ) : (
              <>
                {user?.role !== 'admin' && <NotificationDropdown />}

                {user?.role !== 'admin' && (
                  <NavLink to="/Dashboard">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs gap-1 text-neutral-600 hover:text-neutral-900"
                    >
                      <LayoutDashboard className="h-3 w-3" />
                      <span>Dashboard</span>
                    </Button>
                  </NavLink>
                )}

                <NavLink to="/messenger">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs gap-1 text-neutral-600 hover:text-neutral-900"
                  >
                    <MessageSquare className="h-3 w-3" />
                    <span>Messenger</span>
                  </Button>
                </NavLink>

                {user?.role === 'admin' && (
                  <NavLink to="/admin/Dashboard">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs gap-1 text-neutral-600 hover:text-neutral-900"
                    >
                      <Shield className="h-3 w-3" />
                      <span>Admin Dashboard</span>
                    </Button>
                  </NavLink>
                )}

                <NavLink to="/Logout">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs gap-1 text-neutral-600 hover:text-neutral-900"
                  >
                    <LogOut className="h-3 w-3" />
                    <span>Logout</span>
                  </Button>
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopBar
