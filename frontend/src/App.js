import { useEffect, useState } from "react";
import { Navigate, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Component Imports
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";
import MetaData from "./utils/MetaData";

// Page Imports
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";
import OTPValidation from "./pages/SignUp/OTPValidation";
import Logout from "./pages/Logout/Logout";
import Error from "./pages/Error/Error";
import Dashboard from "./pages/Dashboard/Dashboard";
import SellerProfile from "./pages/SellerProfile/SellerProfile";
import ProductsPage from "./pages/ProductsPage/ProductsPage";
import EditProfile from "./pages/Dashboard/Profile/EditProfile";
import SingleProduct from "./pages/SingleProduct/SingleProduct";
import ProductForms from "./pages/ProductForms/ProductsForms";
import EditProduct from "./pages/Dashboard/MyProducts/EditProduct";
import ViewProductBidders from "./pages/Dashboard/MyProducts/ViewProductBidders";
import DeleteProduct from "./pages/Dashboard/MyProducts/DeleteProduct";
import CategoryPage from "./pages/CategoryPage/CategoryPage";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import PackagesPricing from "./pages/PackagesPricing/PackagesPricing";
import Checkout from "./pages/Checkout/Checkout";

// Admin Imports
import AdminLogin from "./pages/Login/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import AdminEditProfile from "./pages/AdminDashboard/Profile/EditProfile";
import DeleteUser from "./pages/AdminDashboard/AllUsers/DeleteUser";

// Form Imports
import CarForm from "./pages/ProductForms/Vehicles/CarForm";
import BikeForm from "./pages/ProductForms/Vehicles/BikeForm";
import BusesForm from "./pages/ProductForms/Vehicles/BusesForm";
import RickshawForm from "./pages/ProductForms/Vehicles/RickshawForm";
import TractorForm from "./pages/ProductForms/Vehicles/TractorForm";
import OthersForm from "./pages/ProductForms/Vehicles/OthersForm";
import LandForm from "./pages/ProductForms/Properties/LandForm";
import HouseForm from "./pages/ProductForms/Properties/HouseForm";
import ApartmentForm from "./pages/ProductForms/Properties/ApartmentForm";
import ShopForm from "./pages/ProductForms/Properties/ShopForm";
import PortionForm from "./pages/ProductForms/Properties/PortionForm";
import MiscForm from "./pages/ProductForms/Misc/MiscForm";

// Messenger
import Messenger from "./pages/Messenger/Messenger";
import Contact from "./pages/Contact/Contact";

import { getData } from "./helpers/GetData";
import { callProfile } from "./helpers/CallProfile";
import customFetch from "./utils/api";

import "./App.css";

const Routing = ({ isAuthenticated, stripeApiKey }) => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
      <Route path="/signup" element={isAuthenticated ? <Navigate to="/" /> : <SignUp />} />
      <Route path="/user/validate" element={<OTPValidation />} />
      <Route path="/logout" element={isAuthenticated ? <Logout /> : <Navigate to="/" />} />

      {/* Dashboard */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/EditProfile" element={<EditProfile />} />
      <Route path="/user/product/edit/:id" element={<EditProduct />} />
      <Route path="/user/product/bids/all/:id" element={<ViewProductBidders />} />
      <Route path="/user/product/delete/:id" element={<DeleteProduct />} />
      <Route path="/user/forgot-password" element={<ForgotPassword />} />
      <Route path="/user/password/reset/:token" element={<ResetPassword />} />

      {/* Admin Dashboard */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/EditProfile" element={<AdminEditProfile />} />
      <Route path="/admin/DeleteUser/:id" element={<DeleteUser />} />

      {/* Search Results */}
      <Route path="/products" element={<ProductsPage />} />

      {/* Seller Profile */}
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

      {/* Packages Page */}
      <Route path="/packages" element={<PackagesPricing />} />

      {/* Checkout Page */}
      {stripeApiKey && (
        <Route
          path="/checkout"
          element={
            <Elements stripe={loadStripe(stripeApiKey)}>
              <Checkout />
            </Elements>
          }
        />
      )}

      {/* Messenger */}
      <Route path="/messenger" element={isAuthenticated ? <Messenger /> : <Navigate to="/login" />} />
      <Route path="/contact" element={<Contact />} />

      {/* Error */}
      <Route path="*" element={<Error />} />
    </Routes>
  );
};

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { isAuthenticated } = useSelector(state => state.user);
  const [stripeApiKey, setStripeApiKey] = useState("");

  const getStripeApiKey = async () => {
    try {
      const res = await customFetch("/api/v1/stripeapikey", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (res.status === 200) {
        setStripeApiKey(data.stripeApiKey);
      } else {
        console.log(data?.message || "Error loading Stripe api key");
      }
    } catch (error) {
      console.log(error?.message);
    }
  };

  useEffect(() => {
    if (location.pathname === "/messenger") {
      document.querySelector(".footer").style.display = "none";
      document.querySelector(".mc__form-container").style.display = "none";
    } else {
      document.querySelector(".footer").style.display = "block";
      document.querySelector(".mc__form-container").style.display = "block";
    }
  }, [location.pathname]);

  useEffect(() => {
    callProfile(dispatch);
    getData(dispatch);
    getStripeApiKey();
  }, [dispatch]);

  return (
    <>
      <Toaster />
      <Header />
      <MetaData title="Nelami" />
      <Routing isAuthenticated={isAuthenticated} stripeApiKey={stripeApiKey} />
      <Footer />
    </>
  );
}

export default App;
