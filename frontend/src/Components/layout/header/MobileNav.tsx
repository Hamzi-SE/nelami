import { NavLink } from 'react-router-dom'
import { Menu, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useAppSelector } from '@/store/typedHooks'

const LOGO_URL = 'https://assets.ihamza.dev/images/nelami-logo.png'

const categories = [
  { label: 'Vehicles', to: '/categories/Vehicles' },
  { label: 'Properties', to: '/categories/Property' },
  { label: 'Miscellaneous Products', to: '/categories/MiscProducts' },
]

const mainLinks = [
  { label: 'Home', to: '/' },
  { label: 'Products', to: '/Products' },
  { label: 'Contact', to: '/Contact' },
]

const MobileNav = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.user)

  return (
    <div className="lg:hidden">
      <Sheet>
        <SheetTrigger>
          <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader className="px-4 py-4 border-b border-neutral-200">
            <SheetTitle>
              <NavLink to="/">
                <img src={LOGO_URL} alt="Nelami" className="h-8 w-auto" />
              </NavLink>
            </SheetTitle>
          </SheetHeader>

          <nav className="flex flex-col py-2">
            {mainLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-primary-500 bg-primary-50'
                      : 'text-neutral-700 hover:bg-neutral-50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            {/* Categories Section */}
            <div className="px-4 py-3">
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                Categories
              </p>
              <div className="flex flex-col gap-1 pl-2">
                {categories.map((cat) => (
                  <NavLink
                    key={cat.to}
                    to={cat.to}
                    className={({ isActive }) =>
                      `py-2 text-sm transition-colors ${
                        isActive
                          ? 'text-primary-500'
                          : 'text-neutral-600 hover:text-primary-500'
                      }`
                    }
                  >
                    {cat.label}
                  </NavLink>
                ))}
              </div>
            </div>

            {/* Packages */}
            {isAuthenticated ? (
              (user?.role === 'seller' || user?.role === 'admin') && (
                <NavLink
                  to="/Packages"
                  className={({ isActive }) =>
                    `px-4 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-primary-500 bg-primary-50'
                        : 'text-neutral-700 hover:bg-neutral-50'
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
                  `px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-primary-500 bg-primary-50'
                      : 'text-neutral-700 hover:bg-neutral-50'
                  }`
                }
              >
                Packages
              </NavLink>
            )}

            {/* Divider */}
            <div className="border-t border-neutral-200 my-2" />

            {/* Post Free Ad CTA */}
            <div className="px-4 py-2">
              <NavLink to="/product/new">
                <Button className="w-full gap-1.5" size="sm">
                  <Plus className="h-4 w-4" />
                  Post Free Ad
                </Button>
              </NavLink>
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default MobileNav
