import { Toaster } from '@/components/ui/sonner'
import { useReducedMotion } from '@/lib/animations'
import { useAppDispatch, useAppSelector } from '@/store/typedHooks'
import { AnimatePresence, motion } from 'framer-motion'
import { lazy, Suspense, useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'

// Component Imports
import MetaData from '@/lib/MetaData'
import Footer from './components/layout/footer/Footer'
import Header from './components/layout/header/Header'

import { callProfile } from '@/lib/helpers/callProfile'
import { getData } from '@/lib/helpers/getData'

import Loader from './components/Loader/Loader'

// Page Imports
const Home = lazy(() => import('./features/home/pages/HomePage'))
const Login = lazy(() => import('./features/auth/pages/LoginPage'))
const SignUp = lazy(() => import('./features/auth/pages/SignUpPage'))
const OTPValidation = lazy(() => import('./features/auth/pages/OTPValidationPage'))
const Logout = lazy(() => import('./features/pages/LogoutPage'))
const Error = lazy(() => import('./features/pages/ErrorPage'))
const SellerProfile = lazy(() => import('./features/profile/pages/SellerProfilePage'))
const ProductsPage = lazy(() => import('./features/products/pages/ProductsPage'))
const SingleProduct = lazy(() => import('./features/products/pages/ProductDetailPage'))
const ProductForms = lazy(() => import('./features/products/pages/ProductCreatePage'))
const CategoryPage = lazy(() => import('./features/products/pages/CategoryPage'))
const ForgotPassword = lazy(() => import('./features/auth/pages/ForgotPasswordPage'))
const ResetPassword = lazy(() => import('./features/auth/pages/ResetPasswordPage'))
const PackagesPricing = lazy(() => import('./features/pricing/pages/PackagesPricingPage'))
const Checkout = lazy(() => import('./features/payment/pages/CheckoutPage'))
const PaymentSuccess = lazy(() => import('./features/payment/pages/PaymentSuccessPage'))
const PaymentFail = lazy(() => import('./features/payment/pages/PaymentFailPage'))

// Dashboard Imports (Phase 8)
const Dashboard = lazy(() => import('./features/dashboard/pages/DashboardPage'))
const StatsDashboard = lazy(() => import('./features/dashboard/components/DashboardStats'))
const ProfilePage = lazy(() => import('./features/dashboard/pages/ProfilePage'))
const EditProfilePage = lazy(() => import('./features/dashboard/pages/EditProfilePage'))
const MyBidsPage = lazy(() => import('./features/dashboard/pages/MyBidsPage'))
const MyWishlistPage = lazy(() => import('./features/dashboard/pages/MyWishlistPage'))
const SettingsPage = lazy(() => import('./features/dashboard/pages/SettingsPage'))
const SafetyTipsPage = lazy(() => import('./features/dashboard/pages/SafetyTipsPage'))
const MyProductsPage = lazy(() => import('./features/dashboard/pages/MyProductsPage'))
const WaitingApprovalPage = lazy(() => import('./features/dashboard/pages/WaitingApprovalPage'))
const ViewBiddersPage = lazy(() => import('./features/dashboard/pages/ViewBiddersPage'))
const EditProductPage = lazy(() => import('./features/dashboard/pages/EditProductPage'))
const DeleteProductPage = lazy(() => import('./features/dashboard/pages/DeleteProductPage'))

// Admin Imports (Phase 10)
const AdminLogin = lazy(() => import('./features/auth/pages/AdminLoginPage'))
const AdminDashboard = lazy(() => import('./features/admin/pages/AdminDashboardPage'))
const AdminStats = lazy(() => import('./features/admin/components/AdminStats'))
const AdminProfilePage = lazy(() => import('./features/admin/pages/AdminProfilePage'))
const AdminEditProfilePage = lazy(() => import('./features/admin/pages/AdminEditProfilePage'))
const AllUsersPage = lazy(() => import('./features/admin/pages/AllUsersPage'))
const AllProductsPage = lazy(() => import('./features/admin/pages/AllProductsPage'))
const ApprovalPage = lazy(() => import('./features/admin/pages/ApprovalPage'))
const EditFeaturesPage = lazy(() => import('./features/admin/pages/EditFeaturesPage'))
const AdminSettingsPage = lazy(() => import('./features/admin/pages/AdminSettingsPage'))
const DeleteUserPage = lazy(() => import('./features/pages/DeleteUserPage'))

// Messenger (Phase 11)
const Messenger = lazy(() => import('./features/messenger/pages/MessengerPage'))
const Contact = lazy(() => import('./features/contact/pages/ContactPage'))

interface RoutingProps {
  isAuthenticated: boolean
  loading: boolean
}

const Routing = ({ isAuthenticated, loading }: RoutingProps) => {
  const location = useLocation()
  const reduced = useReducedMotion()

  const routes = (
    <Routes location={location}>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
      <Route path="/signup" element={isAuthenticated ? <Navigate to="/" /> : <SignUp />} />
      <Route path="/user/validate" element={<OTPValidation />} />
      <Route path="/logout" element={isAuthenticated ? <Logout /> : <Navigate to="/" />} />

      {/* Dashboard Routes (nested) */}
      <Route path="/dashboard" element={<Dashboard />}>
        <Route index element={<StatsDashboard />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="edit-profile" element={<EditProfilePage />} />
        <Route path="bids" element={<MyBidsPage />} />
        <Route path="wishlist" element={<MyWishlistPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="safety" element={<SafetyTipsPage />} />
        <Route path="products" element={<MyProductsPage />} />
        <Route path="waiting-approval" element={<WaitingApprovalPage />} />
      </Route>

      {/* Backward-compatible /editProfile route */}
      <Route path="/editProfile" element={<EditProfilePage />} />
      {/* Seller routes (new redesigned pages) */}
      <Route path="/user/product/edit/:id" element={<EditProductPage />} />
      <Route path="/user/product/bids/all/:id" element={<ViewBiddersPage />} />
      <Route path="/user/product/delete/:id" element={<DeleteProductPage />} />
      <Route path="/user/forgot-password" element={<ForgotPassword />} />
      <Route path="/user/password/reset/:token" element={<ResetPassword />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Admin Dashboard Routes (nested) */}
      <Route path="/admin/dashboard" element={<AdminDashboard />}>
        <Route index element={<AdminStats />} />
        <Route path="profile" element={<AdminProfilePage />} />
        <Route path="edit-profile" element={<AdminEditProfilePage />} />
        <Route path="users" element={<AllUsersPage />} />
        <Route path="products" element={<AllProductsPage />} />
        <Route path="approvals" element={<ApprovalPage />} />
        <Route path="features" element={<EditFeaturesPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>

      {/* Backward-compatible admin routes */}
      <Route path="/admin/EditProfile" element={<AdminSettingsPage />} />
      <Route path="/admin/deleteUser/:id" element={<DeleteUserPage />} />
      <Route path="/admin/DeleteUser/:id" element={<DeleteUserPage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/user/:id" element={<SellerProfile />} />
      <Route path="/categories/:category" element={<CategoryPage />} />
      <Route path="/product/:id" element={<SingleProduct />} />
      <Route path="/product/new" element={<ProductForms />} />
      <Route path="/packages" element={<PackagesPricing />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/payment-success" element={<PaymentSuccess />} />
      <Route path="/payment-fail" element={<PaymentFail />} />

      <Route
        path="/messenger"
        element={loading ? <Loader /> : isAuthenticated ? <Messenger /> : <Navigate to="/login" replace />}
      />
      <Route path="/contact" element={<Contact />} />
      <Route path="*" element={<Error />} />
    </Routes>
  )

  return (
    <Suspense fallback={<Loader />}>
      {reduced ? (
        routes
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname.split('/')[1]}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {routes}
          </motion.div>
        </AnimatePresence>
      )}
    </Suspense>
  )
}

function App() {
  const dispatch = useAppDispatch()
  const location = useLocation()
  const { isAuthenticated, loading } = useAppSelector((state: any) => state.user)

  useEffect(() => {
    const footer = document.querySelector('.footer')

    const isMessenger = location.pathname === '/messenger'

    if (footer) (footer as HTMLElement).style.display = isMessenger ? 'none' : 'block'
  }, [location.pathname])

  useEffect(() => {
    callProfile(dispatch)
    getData(dispatch)
  }, [dispatch])

  return (
    <>
      <Toaster />
      <Header />
      <MetaData title="Nelami" />
      <Routing isAuthenticated={isAuthenticated} loading={loading} />
      <Footer />
    </>
  )
}

export default App
