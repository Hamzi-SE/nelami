import MetaData from '@/lib/MetaData'
import { Link } from 'react-router-dom'
import SignUpForm from '../components/SignUpForm'

const SignUpPage = () => {
  return (
    <>
      <MetaData title="Sign Up - Nelami" />

      {/* Breadcrumb */}
      <section className="bg-neutral-50 border-b border-neutral-200">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-neutral-900">Register</h1>
          <nav className="flex items-center gap-1.5 mt-1 text-sm text-neutral-500">
            <Link to="/" className="hover:text-primary-500">
              Home
            </Link>
            <span>/</span>
            <span className="text-neutral-700">Register</span>
          </nav>
        </div>
      </section>

      {/* Sign Up Form */}
      <section className="py-12 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-neutral-900">Create an Account</h2>
              <p className="text-sm text-neutral-500 mt-1">Join Nelami to start buying and selling.</p>
            </div>
            <SignUpForm />
          </div>
        </div>
      </section>
    </>
  )
}

export default SignUpPage
