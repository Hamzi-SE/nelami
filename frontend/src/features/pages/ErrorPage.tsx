import { buttonVariants } from '@/components/ui/button'
import MetaData from '@/lib/MetaData'
import { cn } from '@/lib/utils'
import { ArrowLeft, Home } from 'lucide-react'
import { Link } from 'react-router-dom'

const ErrorPage = () => {
  return (
    <>
      <MetaData title="404 - Nelami" />

      <section className="py-20 px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-6">
            <h1 className="text-7xl font-bold text-primary-500">404</h1>
            <p className="text-2xl font-semibold text-neutral-900 mt-2">(x_x)</p>
          </div>

          <h2 className="text-xl font-semibold text-neutral-900 mb-2">Page Not Found</h2>
          <p className="text-neutral-500 mb-8">The page you are looking for does not exist or has been moved.</p>

          <div className="flex items-center justify-center gap-3">
            <Link to="/" className={cn(buttonVariants({ variant: 'outline' }), 'inline-flex items-center gap-2')}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
            <Link to="/" className={cn(buttonVariants({ variant: 'default' }), 'inline-flex items-center gap-2')}>
              <Home className="h-4 w-4" />
              Go Home
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

export default ErrorPage
