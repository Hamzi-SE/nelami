import { Link } from 'react-router-dom'

const footerLinks = [
  { label: 'Home', to: '/' },
  { label: 'Products', to: '/products' },
  { label: 'Packages', to: '/packages' },
  { label: 'Post Free Ad', to: '/product/new' },
  { label: 'Login', to: '/login' },
  { label: 'Register', to: '/Signup' },
]

const BottomFooter = () => {
  return (
    <footer className="bg-neutral-900 text-neutral-300">
      {/* Footer Links */}
      <div className="border-b border-neutral-700">
        <div className="container mx-auto px-4">
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 py-3 text-sm">
            {footerLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Copyright */}
      <div className="container mx-auto px-4 py-4 text-center text-sm text-neutral-400">
        Copyright © {new Date().getFullYear()} Nelami. All rights reserved.
      </div>
    </footer>
  )
}

export default BottomFooter
