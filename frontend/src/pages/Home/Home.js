import React, { useEffect, useState, useMemo  } from "react";
import 'tippy.js/dist/tippy.css';
import { IoCarSportSharp } from "react-icons/io5";
import { MdDevicesOther } from 'react-icons/md';
import { BiBuildingHouse } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";

// CSS
import "./Home.css"

// Sliders
import FeaturedSlider from "./FeaturedSlider"
import VehiclesSlider from "./VehiclesSlider"
import PropertySlider from "./PropertySlider"
import MiscProductSlider from "./MiscProductSlider"

//Utils Import
import {
  getProvinceDropList,
  getIslamabadSectorsDropList,
  getNorthernAreasCitiesDropList,
  getAzadKashmirCitiesDropList,
  getPunjabCitiesDropList,
  getSindhCitiesDropList,
  getBalochistanCitiesDropList,
  getKPKCitiesDropList,
} from "../../utils/PakCitiesData";
import { useDispatch, useSelector } from "react-redux";
import customFetch from "../../utils/api";
import Loader from "../../Components/Loader/Loader";


const Home = () => {
  const dispatch = useDispatch();
  const { data } = useSelector(state => state.data)
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllProducts = async () => {
    dispatch({ type: "ALL_PRODUCTS_REQUEST" });
    try { 
      const res = await customFetch(`/api/v1/products`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })
      const data = await res.json();
      dispatch({ type: "ALL_PRODUCTS_SUCCESS", payload: data.products });
      setProducts(data.products);
    } catch (error) {
      console.log("error: ", error)
      dispatch({ type: "ALL_PRODUCTS_FAIL", payload: error.message });
    } finally {
      setLoading(false);
    }
  }


  const getAllSearchProducts = async () => {
    let link = `/products`
    if (keyword) {
      link += `?keyword=${keyword}`
    }
    if (province) {
      link.includes("?") ? link += "&" : link += "?"
      link += `province=${province}`
    } if (city) {
      link.includes("?") ? link += "&" : link += "?"
      link += `city=${city}`
    } if (category) {
      link.includes("?") ? link += "&" : link += "?"
      link += `category=${category}`
    }
    navigate(link)
  }

  useEffect(() => {
    getAllProducts();
  }, [])

  const featuredSliderMemo = useMemo(() => (
    <FeaturedSlider products={products} />
  ), [products]);
  
  const vehiclesSliderMemo = useMemo(() => (
    <VehiclesSlider products={products} />
  ), [products]);
  
  const propertySliderMemo = useMemo(() => (
    <PropertySlider products={products} />
  ), [products]);
  
  const miscProductSliderMemo = useMemo(() => (
    <MiscProductSlider products={products} />
  ), [products]);

  if (loading) {
    return <Loader />
  }

  

  return (
    <>
      {/* <!--Sliders Section--> */}

      <div className="header-2 mb-5">
        <div className="home-search-banner banner-1 cover-image sptb-2 bg-background" >
          <div className="header-text1 mb-0">
            <div className="container">
              <div className="text-center text-white">
                <h1>Nelami Auction Website</h1>
                <p style={{ marginBottom: "1.5rem", fontSize: "16px", fontWeight: "500" }}>We fetch the best value for your valuables.</p>
              </div>
              <div className="row">
                <div className="col-sm-12 mx-auto">

                  <div className="search-background mb-0">
                    <div className="form row g-0 header-search-input">

                      <div className="form-group">
                        <input type="text" className="form-control input-lg border-end-0" value={keyword} id="text" placeholder="Search Products" onChange={(e) => setKeyword(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <select className="form-control select2-show-search border-bottom-0 w-100 product-page-category-search-option" data-placeholder="Select Category"
                          onChange={async (e) => {
                            setCategory(e.target.value)
                          }}  >
                          <optgroup label="Categories">
                            <option>Select Category</option>
                            <option value="All">All products</option>
                            <option value="Vehicles">Vehicles</option>
                            <option value="Property">Properties</option>
                            <option value="MiscProducts">Miscellaneous Products</option>
                          </optgroup>
                        </select>
                      </div>
                      {/* PRONVINCES LIST */}
                      <div className="form-group">
                        <select id="province" name="province" value={province} onChange={(e) => setProvince(e.target.value)} className="form-control select2-show-search border-bottom-0 w-100 product-page-category-search-option" data-placeholder="Select" required>
                          <option>Select Province</option>
                          {getProvinceDropList(data)}
                        </select>
                      </div>


                      {/* Islamabad CITIES DROPLIST */}
                      {province === "Islamabad" && (
                        <div className="form-group">
                          <select id="pubjab-cities" name="city" value={city} onChange={(e) => setCity(e.target.value)} className="form-control select2-show-search border-bottom-0 w-100 product-page-category-search-option" required>
                            <option value="" disabled defaultValue>
                              Select Sector
                            </option>
                            {getIslamabadSectorsDropList(data)}
                          </select>
                        </div>
                      )}

                      {/* PUNJAB CITIES DROPLIST */}
                      {province === "Punjab" && (
                        <div className="form-group">
                          <select id="pubjab-cities" name="city" value={city} onChange={(e) => setCity(e.target.value)} className="form-control select2-show-search border-bottom-0 w-100 product-page-category-search-option" required>
                            <option value="" disabled defaultValue>
                              Select City
                            </option>
                            {getPunjabCitiesDropList(data)}
                          </select>
                        </div>
                      )}
                      {/* KPK CITIES DROPLIST */}
                      {province === "Khyber Pakhtunkhwa" && (
                        <div className="form-group">
                          <select id="kpk-cities" name="city" value={city} onChange={(e) => setCity(e.target.value)} className="form-control select2-show-search border-bottom-0 w-100 product-page-category-search-option" required>
                            <option value="" disabled defaultValue>
                              Select City
                            </option>
                            {getKPKCitiesDropList(data)}
                          </select>
                        </div>
                      )}
                      {/* Sindh CITIES DROPLIST */}
                      {province === "Sindh" && (
                        <div className="form-group">
                          <select id="sindh-cities" name="city" value={city} onChange={(e) => setCity(e.target.value)} className="form-control select2-show-search border-bottom-0 w-100 product-page-category-search-option" required>
                            <option value="" disabled defaultValue>
                              Select City
                            </option>
                            {getSindhCitiesDropList(data)}
                          </select>
                        </div>
                      )}
                      {/* Balochistan CITIES DROPLIST */}
                      {province === "Balochistan" && (
                        <div className="form-group">
                          <select id="balochistan-cities" name="city" value={city} onChange={(e) => setCity(e.target.value)} className="form-control select2-show-search border-bottom-0 w-100 product-page-category-search-option" required>
                            <option value="" disabled defaultValue>
                              Select City
                            </option>
                            {getBalochistanCitiesDropList(data)}
                          </select>
                        </div>
                      )}
                      {/* Azad Kashmir CITIES DROPLIST */}
                      {province === "Azad Kashmir" && (
                        <div className="form-group">
                          <select id="AzadKashmir-cities" name="city" value={city} onChange={(e) => setCity(e.target.value)} className="form-control select2-show-search border-bottom-0 w-100 product-page-category-search-option" required>
                            <option value="" disabled defaultValue>
                              Select City
                            </option>
                            {getAzadKashmirCitiesDropList(data)}
                          </select>
                        </div>
                      )}
                      {/* Northern Areas CITIES DROPLIST */}
                      {province === "Northern Areas" && (
                        <div className="form-group">
                          <select id="northern-areas-cities" name="city" value={city} onChange={(e) => setCity(e.target.value)} className="form-control select2-show-search border-bottom-0 w-100 product-page-category-search-option" required>
                            <option value="" disabled defaultValue>
                              Select City
                            </option>
                            {getNorthernAreasCitiesDropList(data)}
                          </select>
                        </div>
                      )}




                      <div className="">
                        <button type="button" className="btn btn-lg btn-block btn-secondary" onClick={getAllSearchProducts} >Search</button>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
          {/* <!-- /header-text --> */}
        </div>
      </div>
      {/* <!--/Sliders Section--> */}

      {/* <HeroSlider /> */}


      <div className="container products-slider home-products-slider home-featured-slider">
        <h1 className="text-center">Featured Products</h1>
        {featuredSliderMemo}
      </div>

      <section className="sptb bg-white">
        <div className="container">
          <div className="section-title center-block text-center">
            <h1>Categories</h1>
          </div>
          <div className="item-all-cat center-block text-center">
            <div className="row">

              <div className="home-icon-card col-lg-4 col-md-4 col-sm-6">
                <Link to="/categories/Vehicles">
                  <div className="item-all-card text-dark text-center">
                    <IoCarSportSharp />
                    <h4 className="mb-0 text-body">Vehicles</h4>
                  </div>
                </Link>
              </div>

              <div className="home-icon-card col-lg-4 col-md-4 col-sm-6">
                <Link to="/categories/Property">
                  <div className="item-all-card text-dark text-center">
                    <BiBuildingHouse />
                    <h5 className="mb-0 text-body">Properties</h5>
                  </div>
                </Link>
              </div>

              <div className="home-icon-card col-lg-4 col-md-4 col-sm-6">
                <Link to="/categories/MiscProducts">
                  <div className="item-all-card text-dark text-center">
                    <MdDevicesOther />
                    <h5 className="mb-0 text-body">Miscellaneous</h5>
                  </div>
                </Link>
              </div>

            </div>
          </div>
        </div>
      </section>

      <div className="container products-slider home-products-slider home-vehicles-slider">
        <h1 className="text-center">Top Vehicles</h1>
        {vehiclesSliderMemo}
      </div>
      <div className="container products-slider home-products-slider home-properties-slider">
        <h1 className="text-center">Top Properties</h1>
        {propertySliderMemo}
      </div>
      <div className="container products-slider home-products-slider home-misc-slider">
        <h1 className="text-center">Top Miscellaneous Items</h1>
        {miscProductSliderMemo}
      </div>
    </>
  )
};

export default Home;
