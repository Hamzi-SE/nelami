import { Link, NavLink, useLocation } from 'react-router-dom'
import { ChevronDown, Plus } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useAppSelector } from '@/store/typedHooks'

const LOGO_URL = 'https://assets.ihamza.dev/images/nelami-logo.png'

const categories = [
  { label: 'Vehicles', to: '/categories/Vehicles' },
  { label: 'Properties', to: '/categories/Property' },
  { label: 'Miscellaneous Products', to: '/categories/MiscProducts' },
]

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Products', to: '/Products' },
  { label: 'Contact', to: '/Contact' },
]

const Navbar = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.user)
  const location = useLocation()

  const isActiveCategory = location.pathname.startsWith('/categories')

  return (
    <div className="bg-white border-b border-neutral-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to="/" className="shrink-0">
            <img src={LOGO_URL} alt="Nelami" className="h-10 w-auto" />
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-primary-500 ${
                    isActive ? 'text-primary-500' : 'text-neutral-700'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            {/* Categories Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button
                  variant="ghost"
                  className={`text-sm font-medium gap-1 px-0 hover:text-primary-500 ${
                    isActiveCategory ? 'text-primary-500' : 'text-neutral-700'
                  }`}
                >
                  Categories
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {categories.map((cat) => (
                  <DropdownMenuItem key={cat.to}>
                    <Link to={cat.to} className="cursor-pointer w-full">
                      {cat.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Packages — sellers & admins only when authenticated */}
            {isAuthenticated ? (
              (user?.role === 'seller' || user?.role === 'admin') && (
                <NavLink
                  to="/Packages"
                  className={({ isActive }) =>
                    `text-sm font-medium transition-colors hover:text-primary-500 ${
                      isActive ? 'text-primary-500' : 'text-neutral-700'
                    }`
                  }
                >
                  Packages
                </NavLink>
              )
            ) : (
              <NavLink
                to="/Packages"
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors hover:text-primary-500 ${
                    isActive ? 'text-primary-500' : 'text-neutral-700'
                  }`
                }
              >
                Packages
              </NavLink>
            )}
          </nav>

          {/* CTA — Post Free Ad */}
          <div className="flex items-center gap-3">
            <NavLink to="/product/new" className="hidden lg:inline-flex">
              <Button size="sm" className="gap-1.5">
                <Plus className="h-4 w-4" />
                Post Free Ad
              </Button>
            </NavLink>

            <NavLink to="/product/new" className="lg:hidden">
              <Button size="icon" variant="ghost" aria-label="Post Free Ad">
                <Plus className="h-5 w-5" />
              </Button>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
