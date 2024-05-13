import { useEffect, useState } from "react";
import { Navigate } from 'react-router-dom'
import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux"
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

//Components Import
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";

//Page Imports
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";
import OTPValidation from "./pages/SignUp/OTPValidation";
import Logout from "./pages/Logout/Logout.js";
import Error from "./pages/Error/Error";
import Dashboard from "./pages/Dashboard/Dashboard";
import SellerProfile from "./pages/SellerProfile/SellerProfile";
import ProductsPage from "./pages/ProductsPage/ProductsPage";
import EditProfille from "./pages/Dashboard/Profile/EditProfille";
import SingleProduct from "./pages/SingleProduct/SingleProduct";
import ProductForms from "./pages/ProductForms/ProductsForms";
import EditProduct from "./pages/Dashboard/MyProducts/EditProduct"
import ViewProductBidders from "./pages/Dashboard/MyProducts/ViewProductBidders"
import DeleteProduct from "./pages/Dashboard/MyProducts/DeleteProduct"
import CategoryPage from "./pages/CategoryPage/CategoryPage"
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import PackagesPricing from "./pages/PackagesPricing/PackagesPricing";
import Checkout from "./pages/Checkout/Checkout"

//Admin Imports
import AdminLogin from "./pages/Login/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import EditProfile from "./pages/AdminDashboard/Profile/EditProfille";
import DeleteUser from "./pages/AdminDashboard/AllUsers/DeleteUser";

//Style Imports
import "./App.css";
import "react-toastify/dist/ReactToastify.css";

//Meta Data
import MetaData from "./utils/MetaData";

//Form Imports
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

//Messanger
import Messenger from "./pages/messanger/Messanger";
import Contact from "./pages/Contact/Contact";

import { getData } from "./helpers/GetData";
import { callProfile } from "./helpers/CallProfile";
import customFetch from "./utils/api.js";



const Routing = ({ isAuthenticated, stripeApiKey }) => {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
      <Route path="/Signup" element={isAuthenticated ? <Navigate to="/" /> : <SignUp />} />
      <Route path="/user/validate" element={<OTPValidation />} />
      <Route path="/Logout" element={isAuthenticated ? <Logout /> : <Navigate to='/' />} />

      {/* Dashboard */}
      <Route path="/Dashboard" element={<Dashboard />} />
      <Route path="/EditProfile" element={<EditProfille />} />
      <Route path="/user/product/edit/:id" element={<EditProduct />} />
      <Route path="/user/product/bids/all/:id" element={<ViewProductBidders />} />
      <Route path="/user/product/delete/:id" element={<DeleteProduct />} />
      <Route path="/user/forgot-password" element={<ForgotPassword />} />
      <Route path="/user/password/reset/:token" element={<ResetPassword />} />

      {/* ADMIN Dashboard Routes */}
      <Route path="/admin/Login" element={<AdminLogin />} />
      <Route path="/admin/Dashboard" element={<AdminDashboard />} />
      <Route path="/admin/EditProfile" element={<EditProfile />} />
      <Route path="/admin/DeleteUser/:id" element={<DeleteUser />} />

      {/* Search Results */}
      <Route path="/Products" element={<ProductsPage />} />

      {/* SELLER PROFILE */}
      <Route path="/user/:id" element={<SellerProfile />} />

      <Route path="/categories/:category" element={<CategoryPage />} />
      <Route path="/Product/:id" element={<SingleProduct />} />
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
      {/* ({stripeApiKey && */}
      <Route path="/checkout" element={
        <Elements stripe={loadStripe("pk_test_51LNcLxGQIXrhgyvgX6QfbLYN6g2D9xs26F4CMKYy48KxbzZPKHFhd3Ld5g2yzDaQ54GR88VfSZY4vssv6aoA4qe700pik9CzVA")}>
          <Checkout />
        </Elements>
      }
      />
      {/* }) */}



      {/* MESSANGER */}
      <Route path="/Messenger" element={isAuthenticated ? <Messenger /> : <Navigate to="/login" />} />
      <Route path="/Contact" element={<Contact />} />

      {/* ERROR */}
      <Route path="*" element={<Error />} />
    </Routes>
  );
};

export const toastOptions = {
  position: "top-right",
  autoClose: 1000,
  pauseOnHover: true,
  draggable: true,
  theme: "light",
};

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const { isAuthenticated } = useSelector(state => state.user);
  const [stripeApiKey, setStripeApiKey] = useState("");



  async function getStripeApiKey() {
    try {
      const res = await customFetch("/api/v1/stripeapikey", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json()
      if (res.status === 200) {
        setStripeApiKey(data.stripeApiKey);
      } else {
        console.warn("You must be logged in to get Stripe Api Key")
      }

    } catch (error) {
      console.warn("You must be logged in to get Stripe Api Key")
    }
  } 

  //Hide footer on chat page
  useEffect(() => {
    if (location.pathname === "/Messenger") {
      document.querySelector(".footer").style.display = "none";
      document.querySelector(".mc__form-container").style.display = "none";
    } else {
      document.querySelector(".footer").style.display = "block";
      document.querySelector(".mc__form-container").style.display = "block";
    }
  }, [location.pathname]);



  //Getting User and Data on App Load
  useEffect(() => {
    callProfile(dispatch);
    getData(dispatch);
    getStripeApiKey();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <ToastContainer options={toastOptions} />
      <Header />
      <MetaData title="Nelami" />
      <Routing isAuthenticated={isAuthenticated} stripeApiKey={stripeApiKey} />
      <Footer />
    </>
  );
}

export default App;
