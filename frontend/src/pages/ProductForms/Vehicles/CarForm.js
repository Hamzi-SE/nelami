import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Vehicles.css";
import { BiImageAdd } from "react-icons/bi"
import { useSelector, useDispatch } from "react-redux";
import Loader from "../../../Components/Loader/Loader";

import useImageUpload from "../../../hooks/useImageUpload";
import PostProduct from "../../../helpers/PostProduct";


import {
  getProvinceDropList,
  getIslamabadSectorsDropList,
  getNorthernAreasCitiesDropList,
  getAzadKashmirCitiesDropList,
  getPunjabCitiesDropList,
  getSindhCitiesDropList,
  getBalochistanCitiesDropList,
  getKPKCitiesDropList,
} from "../../../utils/PakCitiesData";

import { getCarMake, getFuelDropList } from "../../../utils/carData";
import getBidTimeDropList from "../../../utils/BidData";

const CarForm = () => {

  const dispatch = useDispatch();
  const { data } = useSelector(state => state.data);
  const { user, isAuthenticated, loading } = useSelector(state => state.user);
  const productLoading = useSelector(state => state.product.loading);

  const navigate = useNavigate();

  const [productData, setProductData] = useState({
    title: "",
    description: "",
    make: "",
    model: "",
    year: "",
    fuelType: "",
    price: "",
    kmsDriven: "",
    province: "",
    city: "",
    bidTime: "",
    category: "Vehicles",
    subCategory: "Cars",
  });

  const {
    featuredImg, imageOne, imageTwo, imageThree,
    previewFeaturedFile, previewFileOne, previewFileTwo, previewFileThree
  } = useImageUpload()


  const handleInputChange = (event) => {
    // eslint-disable-next-line
    if (event.target.name == "featuredImg") {
      const file = event.target.files[0];
      previewFeaturedFile(file);
    }
    // eslint-disable-next-line
    else if (event.target.name == "imageOne") {
      const file = event.target.files[0];
      previewFileOne(file);
    }
    // eslint-disable-next-line
    else if (event.target.name == "imageTwo") {
      const file = event.target.files[0];
      previewFileTwo(file);
    }
    // eslint-disable-next-line
    else if (event.target.name == "imageThree") {
      const file = event.target.files[0];
      previewFileThree(file);
    }
    // eslint-disable-next-line
    else {
      setProductData({ ...productData, [event.target.name]: event.target.value });
    }
  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    // POST PRODUCT
    PostProduct(dispatch, navigate, featuredImg, imageOne, imageTwo, imageThree, productData);

  };

  const getYearDropList = () => {
    const year = new Date().getFullYear();
    return Array.from(new Array(76), (v, i) => (
      <option key={i} value={year - i}>
        {year - i}
      </option>
    ));
  };




  if (loading) {
    return <h1 className="text-center m-5 p-5"><b>Loading...</b></h1>
  }


  if (!isAuthenticated) {
    return <h1 className="text-center m-5 p-5 text-danger"><b>Please login to view this page!</b></h1>
  }
  if (isAuthenticated && user?.role !== "seller") {
    return <h1 className="text-center m-5 p-5 text-danger"><b>{`Role ${user?.role} can not post a Product`}</b></h1>
  }



  return (
    <>
      {productLoading ? <Loader /> : ""}
      <section className="sptb productForm productForm-page">
        <div className="container product-form-page">
          <div className="row">
            <div className="col-12 d-block mx-auto">
              <div className="row">
                <div className="col-xl-12 col-md-12 col-md-12">
                  <div className="card mb-0">
                    <div className="card-header">
                      <h3 className="card-title text-center">
                        <b>Add Car Details</b>
                      </h3>
                    </div>
                    <div className="card-body">
                      <form method="POST" className="product-dataform product-form" encType="multipart/form-data" onSubmit={handleSubmit}>
                        <div className="form-group">
                          <label className="form-label text-dark">Product Title</label>
                          <input type="text" className="form-control" name="title" onChange={handleInputChange} value={productData.title} placeholder="Enter Product Title" />
                        </div>
                        <div className="form-group">
                          <label className="form-label text-dark">Description</label>
                          <textarea className="form-control" maxlength="5000" name="description" onChange={handleInputChange} value={productData.description} placeholder="Enter Product Description" rows="10"></textarea>
                        </div>
                        <div className="form-group">
                          <label className="form-label text-dark">Make</label>
                          {/* <input type="text" className="form-control" placeholder="Select Make" /> */}
                          <select id="make" name="make" onChange={(e) => setProductData({ ...productData, make: e.target.value })} value={productData.make} className="form-control" required>
                            <option value="" disabled selected>
                              Select Car Make
                            </option>
                            {getCarMake(data)}
                          </select>
                        </div>
                        <div className="form-group">
                          <label className="form-label text-dark">Model</label>
                          <input type="text" className="form-control" name="model" value={productData.model} onChange={handleInputChange} placeholder="Select Model" />
                        </div>
                        <div className="form-group">
                          <label className="form-label text-dark">Year</label>
                          <select id="year" name="year" value={productData.year} onChange={(e) => setProductData({ ...productData, year: e.target.value })} className="form-control" required>
                            <option value="" disabled selected>
                              Select Car Year
                            </option>
                            {getYearDropList()}
                          </select>
                        </div>
                        <div className="form-group">
                          <label className="form-label text-dark">Fuel Type</label>
                          <select id="fuelType" name="fuelType" value={productData.fuelType} onChange={(e) => setProductData({ ...productData, fuelType: e.target.value })} className="form-control" required>
                            <option value="" disabled selected>
                              Select Fuel Type
                            </option>
                            {getFuelDropList(data)}
                          </select>
                        </div>
                        <div className="form-group">
                          <label className="form-label text-dark">Set a Starting Price</label>
                          <input type="number" name="price" value={productData.price} onChange={handleInputChange} className="form-control" placeholder="Starting price in Rs." />
                        </div>
                        <div className="form-group">
                          <label className="form-label text-dark">Kilometers Driven</label>
                          <input type="number" name="kmsDriven" value={productData.kmsDriven} onChange={handleInputChange} className="form-control" placeholder="Kilometers driven" />
                        </div>
                        <div className="productform-images">
                          <div className="form-group">
                            <label className="form-label text-dark">Upload Featured Image</label>
                            <div className="img-upload-icon">
                              <BiImageAdd />
                              {featuredImg && <img src={featuredImg} alt="featuredImg" />}
                            </div>
                            <input type="file" name="featuredImg" onChange={handleInputChange} className="form-control" placeholder="Upload Photos" />
                          </div>
                          <div className="form-group">
                            <label className="form-label text-dark">Upload Image 1</label>
                            <div className="img-upload-icon">
                              <BiImageAdd />
                              {imageOne && <img src={imageOne} alt="ImageOne" />}
                            </div>
                            <input type="file" name="imageOne" onChange={handleInputChange} className="form-control" placeholder="Upload Photos" />
                          </div>
                          <div className="form-group">
                            <label className="form-label text-dark">Upload Image 2</label>
                            <div className="img-upload-icon">
                              <BiImageAdd />
                              {imageTwo && <img src={imageTwo} alt="ImageTwo" />}
                            </div>
                            <input type="file" name="imageTwo" onChange={handleInputChange} className="form-control" placeholder="Upload Photos" />
                          </div>
                          <div className="form-group">
                            <label className="form-label text-dark">Upload Image 3</label>
                            <div className="img-upload-icon">
                              <BiImageAdd />
                              {imageThree && <img src={imageThree} alt="imageThree" />}
                            </div>
                            <input type="file" name="imageThree" onChange={handleInputChange} className="form-control" placeholder="Upload Photos" />
                          </div>

                        </div>
                        {/* PRONVINCES LIST */}
                        <div className="form-group">
                          <label className="form-label text-dark">Location</label>
                          <select id="province" name="province" value={productData.province} onChange={(e) => setProductData({ ...productData, province: e.target.value })} className="form-control" required>
                            <option value="" disabled selected>
                              Select Location
                            </option>
                            {getProvinceDropList(data)}
                          </select>
                        </div>

                        {/* Islamabad CITIES DROPLIST */}
                        {productData.province === "Islamabad" && (
                          <div className="form-group">
                            <label className="form-label text-dark">Sector</label>
                            <select id="pubjab-cities" name="city" value={productData.city} onChange={(e) => setProductData({ ...productData, city: e.target.value })} className="form-control" required>
                              <option value="" disabled selected>
                                Select Sector
                              </option>
                              {getIslamabadSectorsDropList(data)}
                            </select>
                          </div>
                        )}

                        {/* PUNJAB CITIES DROPLIST */}
                        {productData.province === "Punjab" && (
                          <div className="form-group">
                            <label className="form-label text-dark">City</label>
                            <select id="pubjab-cities" name="city" value={productData.city} onChange={(e) => setProductData({ ...productData, city: e.target.value })} className="form-control" required>
                              <option value="" disabled selected>
                                Select City
                              </option>
                              {getPunjabCitiesDropList(data)}
                            </select>
                          </div>
                        )}
                        {/* KPK CITIES DROPLIST */}
                        {productData.province === "Khyber Pakhtunkhwa" && (
                          <div className="form-group">
                            <label className="form-label text-dark">City</label>
                            <select id="kpk-cities" name="city" value={productData.city} onChange={(e) => setProductData({ ...productData, city: e.target.value })} className="form-control" required>
                              <option value="" disabled selected>
                                Select City
                              </option>
                              {getKPKCitiesDropList(data)}
                            </select>
                          </div>
                        )}
                        {/* Sindh CITIES DROPLIST */}
                        {productData.province === "Sindh" && (
                          <div className="form-group">
                            <label className="form-label text-dark">City</label>
                            <select id="sindh-cities" name="city" value={productData.city} onChange={(e) => setProductData({ ...productData, city: e.target.value })} className="form-control" required>
                              <option value="" disabled selected>
                                Select City
                              </option>
                              {getSindhCitiesDropList(data)}
                            </select>
                          </div>
                        )}
                        {/* Balochistan CITIES DROPLIST */}
                        {productData.province === "Balochistan" && (
                          <div className="form-group">
                            <label className="form-label text-dark">City</label>
                            <select id="balochistan-cities" name="city" value={productData.city} onChange={(e) => setProductData({ ...productData, city: e.target.value })} className="form-control" required>
                              <option value="" disabled selected>
                                Select City
                              </option>
                              {getBalochistanCitiesDropList(data)}
                            </select>
                          </div>
                        )}
                        {/* Azad Kashmir CITIES DROPLIST */}
                        {productData.province === "Azad Kashmir" && (
                          <div className="form-group">
                            <label className="form-label text-dark">City</label>
                            <select id="AzadKashmir-cities" name="city" value={productData.city} onChange={(e) => setProductData({ ...productData, city: e.target.value })} className="form-control" required>
                              <option value="" disabled selected>
                                Select City
                              </option>
                              {getAzadKashmirCitiesDropList(data)}
                            </select>
                          </div>
                        )}
                        {/* Northern Areas CITIES DROPLIST */}
                        {productData.province === "Northern Areas" && (
                          <div className="form-group">
                            <label className="form-label text-dark">City</label>
                            <select id="northern-areas-cities" name="city" value={productData.city} onChange={(e) => setProductData({ ...productData, city: e.target.value })} className="form-control" required>
                              <option value="" disabled selected>
                                Select City
                              </option>
                              {getNorthernAreasCitiesDropList(data)}
                            </select>
                          </div>
                        )}

                        <div className="form-group">
                          <label className="form-label text-dark">Bid Time</label>
                          <select id="bid-time" name="bidTime" value={productData.bidTime} onChange={(e) => setProductData({ ...productData, bidTime: e.target.value })} className="form-control" required>
                            <option value="" disabled>
                              Select Bid Live Time
                            </option>
                            {/* {data?.bidTimeList?.map(day => <option value={day}>{day} {day === 1 ? "Day" : "Days"}</option>)} */}
                            {getBidTimeDropList(data)}
                          </select>
                        </div>
                        <div>
                          <button type="submit" className="btn btn-primary">
                            Upload Product
                          </button>
                        </div>
                      </form>





                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  );
};

export default CarForm;
