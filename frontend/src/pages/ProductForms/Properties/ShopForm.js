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

const ShopForm = () => {


    const dispatch = useDispatch();
    const { user, isAuthenticated, loading } = useSelector(state => state.user);
    const { data } = useSelector(state => state.data)
    const productLoading = useSelector(state => state.product.loading);

    const navigate = useNavigate();

    const [productData, setProductData] = useState({
        title: "",
        description: "",
        type: "",
        floorLevel: "",
        features: [],
        areaUnit: "",
        area: "",
        price: "",
        province: "",
        city: "",
        bidTime: "",
        category: "Property",
        subCategory: "Shops - Offices - Commercial Space",
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

            case "type":
                if (e.target.checked) {
                    setProductData({ ...productData, "type": e.target.value })
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
                                                <b>Add Shop/Office/Commercial Space Details</b>
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
                                                    <label className="form-label text-dark">Type</label>
                                                    <div className="available-options">
                                                        <div className="form-control">
                                                            <input type="radio" id="Office" name="type" value="Office" data-collection="type" onChange={handleOptionsChange} />
                                                            <label htmlFor="Office"> Office</label>
                                                        </div>
                                                        <div className="form-control">
                                                            <input type="radio" id="Shop" name="type" value="Shop" data-collection="type" onChange={handleOptionsChange} />
                                                            <label htmlFor="Shop"> Shop</label>
                                                        </div>
                                                        <div className="form-control">
                                                            <input type="radio" id="Warehouse" name="type" value="Warehouse" data-collection="type" onChange={handleOptionsChange} />
                                                            <label htmlFor="Warehouse"> Warehouse</label>
                                                        </div>
                                                        <div className="form-control">
                                                            <input type="radio" id="Factory" name="type" value="Factory" data-collection="type" onChange={handleOptionsChange} />
                                                            <label htmlFor="Factory"> Factory</label>
                                                        </div>
                                                        <div className="form-control">
                                                            <input type="radio" id="Building" name="type" value="Building" data-collection="type" onChange={handleOptionsChange} />
                                                            <label htmlFor="Building"> Building</label>
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
                                                    <label className="form-label text-dark">Features</label>
                                                    <div className="available-options">
                                                        <div className="form-control">
                                                            <input type="checkbox" id="Parking Spaces Available" name="Parking Spaces Available" value="Parking Spaces Available" data-collection="features" onChange={handleOptionsChange} />
                                                            <label htmlFor="Parking Spaces Available"> Parking Spaces Available</label>
                                                        </div>
                                                        <div className="form-control">
                                                            <input type="checkbox" id="Lobby in Building" name="Lobby in Building" value="Lobby in Building" data-collection="features" onChange={handleOptionsChange} />
                                                            <label htmlFor="Lobby in Building"> Lobby in Building</label>
                                                        </div>
                                                        <div className="form-control">
                                                            <input type="checkbox" id="Double Glazed Windows" name="Double Glazed Windows" value="Double Glazed Windows" data-collection="features" onChange={handleOptionsChange} />
                                                            <label htmlFor="Double Glazed Windows"> Double Glazed Windows</label>
                                                        </div>
                                                        <div className="form-control">
                                                            <input type="checkbox" id="Central Air Conditiong" name="Central Air Conditiong" value="Central Air Conditiong" data-collection="features" onChange={handleOptionsChange} />
                                                            <label htmlFor="Central Air Conditiong"> Central Air Conditiong</label>
                                                        </div>
                                                        <div className="form-control">
                                                            <input type="checkbox" id="Central Heating" name="Central Heating" value="Central Heating" data-collection="features" onChange={handleOptionsChange} />
                                                            <label htmlFor="Central Heating"> Central Heating</label>
                                                        </div>
                                                        <div className="form-control">
                                                            <input type="checkbox" id="Electricity Backup" name="Electricity Backup" value="Electricity Backup" data-collection="features" onChange={handleOptionsChange} />
                                                            <label htmlFor="Electricity Backup"> Electricity Backup</label>
                                                        </div>
                                                        <div className="form-control">
                                                            <input type="checkbox" id="Waste Disposal" name="Waste Disposal" value="Waste Disposal" data-collection="features" onChange={handleOptionsChange} />
                                                            <label htmlFor="Waste Disposal"> Waste Disposal</label>
                                                        </div>
                                                        <div className="form-control">
                                                            <input type="checkbox" id="Elevators" name="Elevators" value="Elevators" data-collection="features" onChange={handleOptionsChange} />
                                                            <label htmlFor="Elevators"> Elevators</label>
                                                        </div>
                                                    </div>
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

export default ShopForm;
