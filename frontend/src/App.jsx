import React, { lazy, Suspense, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'

// Component Imports
import Footer from './Components/Footer/Footer'
import Header from './Components/Header/Header'
import MetaData from './utils/MetaData'

import { callProfile } from './helpers/CallProfile'
import { getData } from './helpers/GetData'

import './App.css'
import Loader from './Components/Loader/Loader'

// Page Imports
const Home = lazy(() => import('./pages/Home/Home'))
const Login = lazy(() => import('./pages/Login/Login'))
const SignUp = lazy(() => import('./pages/SignUp/SignUp'))
const OTPValidation = lazy(() => import('./pages/SignUp/OTPValidation'))
const Logout = lazy(() => import('./pages/Logout/Logout'))
const Error = lazy(() => import('./pages/Error/Error'))
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'))
const SellerProfile = lazy(() => import('./pages/SellerProfile/SellerProfile'))
const ProductsPage = lazy(() => import('./pages/ProductsPage/ProductsPage'))
const EditProfile = lazy(() => import('./pages/Dashboard/Profile/EditProfile'))
const SingleProduct = lazy(() => import('./pages/SingleProduct/SingleProduct'))
const ProductForms = lazy(() => import('./pages/ProductForms/ProductsForms'))
const EditProduct = lazy(() => import('./pages/Dashboard/MyProducts/EditProduct'))
const ViewProductBidders = lazy(() => import('./pages/Dashboard/MyProducts/ViewProductBidders'))
const DeleteProduct = lazy(() => import('./pages/Dashboard/MyProducts/DeleteProduct'))
const CategoryPage = lazy(() => import('./pages/CategoryPage/CategoryPage'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/ResetPassword/ResetPassword'))
const PackagesPricing = lazy(() => import('./pages/PackagesPricing/PackagesPricing'))
const Checkout = lazy(() => import('./pages/Checkout/Checkout'))
const PaymentSuccess = lazy(() => import('./pages/Payment/PaymentSuccess'))
const PaymentFail = lazy(() => import('./pages/Payment/PaymentFail'))

// Admin Imports
const AdminLogin = lazy(() => import('./pages/Login/AdminLogin'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard/AdminDashboard'))
const AdminEditProfile = lazy(() => import('./pages/AdminDashboard/Profile/EditProfile'))
const DeleteUser = lazy(() => import('./pages/AdminDashboard/AllUsers/DeleteUser'))

// Form Imports
const CarForm = lazy(() => import('./pages/ProductForms/Vehicles/CarForm'))
const BikeForm = lazy(() => import('./pages/ProductForms/Vehicles/BikeForm'))
const BusesForm = lazy(() => import('./pages/ProductForms/Vehicles/BusesForm'))
const RickshawForm = lazy(() => import('./pages/ProductForms/Vehicles/RickshawForm'))
const TractorForm = lazy(() => import('./pages/ProductForms/Vehicles/TractorForm'))
const OthersForm = lazy(() => import('./pages/ProductForms/Vehicles/OthersForm'))
const LandForm = lazy(() => import('./pages/ProductForms/Properties/LandForm'))
const HouseForm = lazy(() => import('./pages/ProductForms/Properties/HouseForm'))
const ApartmentForm = lazy(() => import('./pages/ProductForms/Properties/ApartmentForm'))
const ShopForm = lazy(() => import('./pages/ProductForms/Properties/ShopForm'))
const PortionForm = lazy(() => import('./pages/ProductForms/Properties/PortionForm'))
const MiscForm = lazy(() => import('./pages/ProductForms/Misc/MiscForm'))

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
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/EditProfile" element={<EditProfile />} />
        <Route path="/user/product/edit/:id" element={<EditProduct />} />
        <Route path="/user/product/bids/all/:id" element={<ViewProductBidders />} />
        <Route path="/user/product/delete/:id" element={<DeleteProduct />} />
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
        <Route path="/product/new/car" element={<CarForm />} />
        <Route path="/product/new/bike" element={<BikeForm />} />
        <Route path="/product/new/bus" element={<BusesForm />} />
        <Route path="/product/new/rickshaw" element={<RickshawForm />} />
        <Route path="/product/new/tractor" element={<TractorForm />} />
        <Route path="/product/new/other-vehicle" element={<OthersForm />} />
        <Route path="/product/new/land" element={<LandForm />} />
        <Route path="/product/new/house" element={<HouseForm />} />
        <Route path="/product/new/apartment" element={<ApartmentForm />} />
        <Route path="/product/new/shop" element={<ShopForm />} />
        <Route path="/product/new/portion" element={<PortionForm />} />
        <Route path="/product/new/misc" element={<MiscForm />} />
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
    if (location.pathname === '/messenger') {
      document.querySelector('.footer').style.display = 'none'
      document.querySelector('.mc__form-container').style.display = 'none'
    } else {
      document.querySelector('.footer').style.display = 'block'
      document.querySelector('.mc__form-container').style.display = 'block'
    }
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
