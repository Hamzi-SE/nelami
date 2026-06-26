import React, { lazy, Suspense, useEffect } from 'react'
import { Toaster } from '@/components/ui/sonner'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'

// Component Imports
import Footer from './components/layout/footer/Footer'
import Header from './components/layout/header/Header'
import MetaData from './utils/MetaData'

import { callProfile } from './helpers/CallProfile'
import { getData } from './helpers/GetData'

import './App.css'
import Loader from './Components/Loader/Loader'

// Page Imports
const Home = lazy(() => import('./features/home/pages/HomePage'))
const Login = lazy(() => import('./features/auth/pages/LoginPage'))
const SignUp = lazy(() => import('./features/auth/pages/SignUpPage'))
const OTPValidation = lazy(() => import('./features/auth/pages/OTPValidationPage'))
const Logout = lazy(() => import('./pages/Logout/Logout'))
const Error = lazy(() => import('./pages/Error/Error'))
const SellerProfile = lazy(() => import('./pages/SellerProfile/SellerProfile'))
const ProductsPage = lazy(() => import('./features/products/pages/ProductsPage'))
const SingleProduct = lazy(() => import('./features/products/pages/ProductDetailPage'))
const ProductForms = lazy(() => import('./features/products/pages/ProductCreatePage'))
// Legacy seller pages replaced by features/dashboard/pages versions above
const CategoryPage = lazy(() => import('./features/products/pages/CategoryPage'))
const ForgotPassword = lazy(() => import('./features/auth/pages/ForgotPasswordPage'))
const ResetPassword = lazy(() => import('./features/auth/pages/ResetPasswordPage'))
const PackagesPricing = lazy(() => import('./pages/PackagesPricing/PackagesPricing'))
const Checkout = lazy(() => import('./pages/Checkout/Checkout'))
const PaymentSuccess = lazy(() => import('./pages/Payment/PaymentSuccess'))
const PaymentFail = lazy(() => import('./pages/Payment/PaymentFail'))

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

// Admin Imports
const AdminLogin = lazy(() => import('./features/auth/pages/AdminLoginPage'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard/AdminDashboard'))
const AdminEditProfile = lazy(() => import('./pages/AdminDashboard/Profile/EditProfile'))
const DeleteUser = lazy(() => import('./pages/AdminDashboard/AllUsers/DeleteUser'))

// Messenger
const Messenger = lazy(() => import('./pages/Messenger/Messenger'))
const Contact = lazy(() => import('./pages/Contact/Contact'))

const Routing = ({ isAuthenticated, loading }) => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
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
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/EditProfile" element={<AdminEditProfile />} />
        <Route path="/admin/DeleteUser/:id" element={<DeleteUser />} />
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
    </Suspense>
  )
}

function App() {
  const dispatch = useDispatch()
  const location = useLocation()
  const { isAuthenticated, loading } = useSelector((state) => state.user)

  useEffect(() => {
    const footer = document.querySelector('.footer')
    const form = document.querySelector('.mc__form-container')

    const isMessenger = location.pathname === '/messenger'

    if (footer) footer.style.display = isMessenger ? 'none' : 'block'
    if (form) form.style.display = isMessenger ? 'none' : 'block'
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
