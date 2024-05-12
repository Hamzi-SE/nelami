import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiImageAdd } from "react-icons/bi"
import { useSelector, useDispatch } from "react-redux";
import Loader from "../../../Components/Loader/Loader";
import "./Properties.css";

import useImageUpload from "../../../hooks/useImageUpload";
import PostProduct from "../../../helpers/PostProduct";

import { getProvinceDropList, getIslamabadSectorsDropList, getNorthernAreasCitiesDropList, getAzadKashmirCitiesDropList, getPunjabCitiesDropList, getSindhCitiesDropList, getBalochistanCitiesDropList, getKPKCitiesDropList } from "../../../utils/PakCitiesData";

import getBidTimeDropList from "../../../utils/BidData";

const ApartmentForm = () => {

    const dispatch = useDispatch();
    const { user, isAuthenticated, loading } = useSelector(state => state.user);
    const { data } = useSelector(state => state.data);
    const productLoading = useSelector(state => state.product.loading);

    const navigate = useNavigate();

    const [productData, setProductData] = useState({
        title: "",
        description: "",
        furnished: "",
        bedrooms: "",
        bathrooms: "",
        features: [],
        floorLevel: "",
        areaUnit: "",
        area: "",
        price: "",
        province: "",
        city: "",
        bidTime: "",
        category: "Property",
        subCategory: "Apartments & Flats",
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



    const handleOptionsChange = (e) => {
        switch (e.target.dataset.collection) {
            case "features":
                let arrCopy = [...productData.features]
                if (e.target.checked) {
                    arrCopy.push(e.target.value)
                } else if (!e.target.checked) {
                    const index = arrCopy.indexOf(e.target.value);
                    if (index > -1) {
                        arrCopy.splice(index, 1);
                    }
                }
                setProductData({ ...productData, features: arrCopy })
                break;

            case "areaUnit":
                if (e.target.checked) {
                    setProductData({ ...productData, "areaUnit": e.target.value })
                }
                break;

            case "furnished":
                if (e.target.checked) {
                    setProductData({ ...productData, "furnished": e.target.value })
                }
                break;
            default:
                break;

        }
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        // POST PRODUCT
        PostProduct(dispatch, navigate, featuredImg, imageOne, imageTwo, imageThree, productData);

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
                                                <b>Add House Details</b>
                                            </h3>
                                        </div>
                                        <div className="card-body">
                                            <form method="POST" className="product-dataform product-form" encType="multipart/form-data" onSubmit={handleSubmit}>
                                                <div className="form-group">
                                                    <label className="form-label text-dark">Ad Title</label>
                                                    <input type="text" className="form-control" name="title" onChange={handleInputChange} value={productData.title} placeholder="Enter Product Title" />
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label text-dark">Description</label>
                                                    <textarea className="form-control" maxlength="5000" name="description" onChange={handleInputChange} value={productData.description} placeholder="Enter Product Description" rows="10"></textarea>
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label text-dark">Furnished</label>
                                                    <div className="available-options">
                                                        <div className="form-control">
                                                            <input type="radio" id="Furnished" name="furnished" value="Furnished" data-collection="furnished" onChange={handleOptionsChange} />
                                                            <label htmlFor="Furnished"> Furnished</label>
                                                        </div>
                                                        <div className="form-control">
                                                            <input type="radio" id="Unfurnished" name="furnished" value="Unfurnished" data-collection="furnished" onChange={handleOptionsChange} />
                                                            <label htmlFor="Unfurnished"> Unfurnished </label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label text-dark">Bedrooms</label>
                                                    <select id="bedrooms" name="bedrooms" value={productData.bedrooms} onChange={(e) => setProductData({ ...productData, bedrooms: e.target.value })} className="form-control" required>
                                                        <option value="" disabled selected>
                                                            Select Bedrooms
                                                        </option>
                                                        <option value="1">1</option>
                                                        <option value="2">2</option>
                                                        <option value="3">3</option>
                                                        <option value="4">4</option>
                                                        <option value="5">5</option>
                                                        <option value="6+">6+</option>
                                                        <option value="Studio">Studio</option>
                                                    </select>
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label text-dark">Bathrooms</label>
                                                    <select id="bathrooms" name="bathrooms" value={productData.bathrooms} onChange={(e) => setProductData({ ...productData, bathrooms: e.target.value })} className="form-control" required>
                                                        <option value="" disabled selected>
                                                            Select Bathrooms
                                                        </option>
                                                        <option value="1">1</option>
                                                        <option value="2">2</option>
                                                        <option value="3">3</option>
                                                        <option value="4">4</option>
                                                        <option value="5">5</option>
                                                        <option value="6">6</option>
                                                        <option value="7+">7+</option>
                                                    </select>
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label text-dark">Features</label>
                                                    <div className="available-options">
                                                        <div className="form-control">
                                                            <input type="checkbox" id="Servant Quarters" name="Servant Quarters" value="Servant Quarters" data-collection="features" onChange={handleOptionsChange} />
                                                            <label htmlFor="Servant Quarters"> Servant Quarters</label>
                                                        </div>
                                                        <div className="form-control">
                                                            <input type="checkbox" id="Drawing Room" name="Drawing Room" value="Drawing Room" data-collection="features" onChange={handleOptionsChange} />
                                                            <label htmlFor="Drawing Room"> Drawing Room</label>
                                                        </div>
                                                        <div className="form-control">
                                                            <input type="checkbox" id="Dining Room" name="Dining Room" value="Dining Room" data-collection="features" onChange={handleOptionsChange} />
                                                            <label htmlFor="Dining Room"> Dining Room</label>
                                                        </div>
                                                        <div className="form-control">
                                                            <input type="checkbox" id="Kitchen" name="Kitchen" value="Kitchen" data-collection="features" onChange={handleOptionsChange} />
                                                            <label htmlFor="Kitchen"> Kitchen</label>
                                                        </div>
                                                        <div className="form-control">
                                                            <input type="checkbox" id="Study Room" name="Study Room" value="Study Room" data-collection="features" onChange={handleOptionsChange} />
                                                            <label htmlFor="Study Room"> Study Room</label>
                                                        </div>
                                                        <div className="form-control">
                                                            <input type="checkbox" id="Prayer Room" name="Prayer Room" value="Prayer Room" data-collection="features" onChange={handleOptionsChange} />
                                                            <label htmlFor="Prayer Room"> Prayer Room</label>
                                                        </div>
                                                        <div className="form-control">
                                                            <input type="checkbox" id="Powder Room" name="Powder Room" value="Powder Room" data-collection="features" onChange={handleOptionsChange} />
                                                            <label htmlFor="Powder Room"> Powder Room</label>
                                                        </div>
                                                        <div className="form-control">
                                                            <input type="checkbox" id="Gym" name="Gym" value="Gym" data-collection="features" onChange={handleOptionsChange} />
                                                            <label htmlFor="Gym"> Gym</label>
                                                        </div>
                                                        <div className="form-control">
                                                            <input type="checkbox" id="Store Room" name="Store Room" value="Store Room" data-collection="features" onChange={handleOptionsChange} />
                                                            <label htmlFor="Store Room"> Store Room</label>
                                                        </div>
                                                        <div className="form-control">
                                                            <input type="checkbox" id="Steam Room" name="Steam Room" value="Steam Room" data-collection="features" onChange={handleOptionsChange} />
                                                            <label htmlFor="Steam Room"> Steam Room</label>
                                                        </div>
                                                        <div className="form-control">
                                                            <input type="checkbox" id="Lounge or Sitting Room" name="Lounge or Sitting Room" value="Lounge or Sitting Room" data-collection="features" onChange={handleOptionsChange} />
                                                            <label htmlFor="Lounge or Sitting Room"> Lounge or Sitting Room</label>
                                                        </div>
                                                        <div className="form-control">
                                                            <input type="checkbox" id="Laundry Room" name="Laundry Room" value="Laundry Room" data-collection="features" onChange={handleOptionsChange} />
                                                            <label htmlFor="Laundry Room"> Laundry Room</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label text-dark">Floor Level</label>
                                                    <select id="floorLevel" name="floorLevel" value={productData.floorLevel} onChange={(e) => setProductData({ ...productData, floorLevel: e.target.value })} className="form-control" required>
                                                        <option value="" disabled selected>
                                                            Select Floor Level
                                                        </option>
                                                        <option value="1">1</option>
                                                        <option value="2">2</option>
                                                        <option value="3">3</option>
                                                        <option value="4">4</option>
                                                        <option value="5">5</option>
                                                        <option value="6">6</option>
                                                        <option value="7+">7+</option>
                                                    </select>
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label text-dark">Area Unit</label>
                                                    <div className="available-options">
                                                        <div className="form-control">
                                                            <input type="radio" id="Kanal" name="areaUnit" value="Kanal" data-collection="areaUnit" onChange={handleOptionsChange} />
                                                            <label htmlFor="Kanal"> Kanal</label>
                                                        </div>
                                                        <div className="form-control">
                                                            <input type="radio" id="Marla" name="areaUnit" value="Marla" data-collection="areaUnit" onChange={handleOptionsChange} />
                                                            <label htmlFor="Marla"> Marla</label>
                                                        </div>
                                                        <div className="form-control">
                                                            <input type="radio" id="Square Feet" name="areaUnit" value="Square Feet" data-collection="areaUnit" onChange={handleOptionsChange} />
                                                            <label htmlFor="Square Feet"> Square Feet</label>
                                                        </div>
                                                        <div className="form-control">
                                                            <input type="radio" id="Square Meter" name="areaUnit" value="Square Meter" data-collection="areaUnit" onChange={handleOptionsChange} />
                                                            <label htmlFor="Square Meter"> Square Meter</label>
                                                        </div>
                                                        <div className="form-control">
                                                            <input type="radio" id="Square Yards" name="areaUnit" value="Square Yards" data-collection="areaUnit" onChange={handleOptionsChange} />
                                                            <label htmlFor="Square Yards"> Square Yards</label>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="form-group">
                                                    <label className="form-label text-dark">Area</label>
                                                    <input type="number" name="area" value={productData.area} onChange={handleInputChange} className="form-control" placeholder="Enter Area" />

                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label text-dark">Set a Starting Price</label>
                                                    <input type="number" name="price" value={productData.price} onChange={handleInputChange} className="form-control" placeholder="Starting price in Rs." />
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
                                                        Post now
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

export default ApartmentForm;
