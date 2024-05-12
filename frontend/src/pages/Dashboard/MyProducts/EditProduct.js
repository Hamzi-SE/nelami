import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { toastOptions } from "../../../App";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../../Components/Loader/Loader";
import moment from "moment";
import customFetch from "../../../utils/api";

const EditProfille = () => {
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useSelector(state => state.user);
    const { product, loading } = useSelector(state => state.product);
    const navigate = useNavigate();
    const [productDetails, setProductDetails] = useState({});
    const { id } = useParams();


    const loadProductDetails = async () => {
        // const res = await customFetch(`/api/v1/product/${id}`, {
        dispatch({ type: "LOAD_PRODUCT_REQUEST" });
        const res = await customFetch(`/api/v1/products/${id}`, {
            method: "GET",
            "Content-Type": "application/json",
        });
        try {
            const data = await res.json();
            if (res.status === 200) {
                dispatch({ type: "LOAD_PRODUCT_SUCCESS", payload: data.product });
                setProductDetails(data.product);
            } else {
                dispatch({ type: "LOAD_PRODUCT_FAIL", payload: data.message });
                toast.error(data.message, toastOptions);
                navigate("/");
            }
        } catch (error) {
            dispatch({ type: "LOAD_PRODUCT_FAIL", payload: error });
            console.log(error);
        }
    }



    useEffect(() => {
        loadProductDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const handleChange = async (e) => {
        setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        dispatch({ type: "UPDATE_PRODUCT_REQUEST" });

        const { title, model, description } = productDetails;
        const res = await customFetch(`/api/v1/product/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title,
                model,
                description,
            }),
        });
        const data = await res.json();
        if (res.status === 200) {
            dispatch({ type: "UPDATE_PRODUCT_SUCCESS", payload: data.product });
            toast.success("Product Updated Successfully", toastOptions);
            navigate("/Dashboard");
        } else {
            dispatch({ type: "UPDATE_PRODUCT_FAIL", payload: data.message });
            toast.error(data.message, toastOptions);
        }
    };

    if (loading) {
        return <Loader />
    } else if (!isAuthenticated) {
        return <h1>Please Login to access this page</h1>
    } else if (user?._id !== product?.user?._id) {
        return <h1 className="text-center text-danger py-5 my-5">You are not authorized to access this page</h1>
    }

    return (
        <>
            {productDetails &&
                <div className="col-xl-9 col-lg-12 col-md-12 my-5 mx-auto">
                    <div className="card mb-0">
                        <div className="card-header">
                            <h1 className="card-title">
                                <strong>Edit Product</strong>
                            </h1>
                        </div>
                        <form method="PUT" onSubmit={handleUpdate} >
                            <div className="card-body text-center item-user">
                                <div className="profile-pic">
                                    <div className="product-pic-img w-50">
                                        {productDetails?.images && <img className="w-25" src={productDetails?.images.featuredImg.url} alt="product" />}
                                    </div>
                                    <h3 className="mt-3 mb-0 font-weight-semibold">{productDetails.title}</h3>
                                    <h3 className="mt-3 mb-0 font-weight-semibold text-success" style={{ textTransform: "capitalize" }}>
                                        {productDetails?.bidStatus}
                                    </h3>
                                </div>

                            </div>
                            <div className="card-body">
                                <div className="row">
                                    {productDetails?.title && <div className="col-sm-6 col-md-6">
                                        <div className="form-group">
                                            <label className="form-label">Title</label>
                                            <input type="text" className="form-control" placeholder="Title" value={productDetails?.title} name="title" onChange={handleChange} />
                                        </div>
                                    </div>}

                                    {productDetails?.furnished && <div className="col-sm-6 col-md-6">
                                        <div className="form-group">
                                            <label className="form-label">Furnished</label>
                                            <input type="text" value={productDetails?.furnished} title="You can not change this" className="form-control editForm-not-editable" placeholder="Bedrooms" readOnly="readOnly" />
                                        </div>
                                    </div>}

                                    {productDetails?.bedrooms && <div className="col-sm-6 col-md-6">
                                        <div className="form-group">
                                            <label className="form-label">Bedrooms</label>
                                            <input type="number" name="bedrooms" value={productDetails?.bedrooms} className="form-control" placeholder="Bedrooms" onChange={handleChange} />
                                        </div>
                                    </div>}
                                    {productDetails?.bathrooms && <div className="col-sm-6 col-md-6">
                                        <div className="form-group">
                                            <label className="form-label">Bathrooms</label>
                                            <input type="number" name="bathrooms" value={productDetails?.bathrooms} className="form-control" placeholder="bathrooms" onChange={handleChange} />
                                        </div>
                                    </div>}
                                    {productDetails?.noOfStoreys && <div className="col-sm-6 col-md-6">
                                        <div className="form-group">
                                            <label className="form-label">No of Storeys</label>
                                            <input type="number" name="noOfStoreys" value={productDetails?.noOfStoreys} className="form-control" placeholder="noOfStoreys" onChange={handleChange} />
                                        </div>
                                    </div>}
                                    {productDetails?.constructionState && <div className="col-sm-6 col-md-6">
                                        <div className="form-group">
                                            <label className="form-label">Construction State</label>
                                            <input type="text" value={productDetails?.constructionState} title="You can not change construction state" className="form-control editForm-not-editable" placeholder="constructionState" readOnly="readOnly" />
                                        </div>
                                    </div>}
                                    {productDetails?.type && <div className="col-sm-6 col-md-6">
                                        <div className="form-group">
                                            <label className="form-label">Product Type</label>
                                            <input type="text" value={productDetails?.type} title="You can not change product type" className="form-control editForm-not-editable" placeholder="type" readOnly="readOnly" />
                                        </div>
                                    </div>}


                                    {/* FEATURES */}


                                    {productDetails?.make && <div className="col-sm-6 col-md-6">
                                        <div className="form-group">
                                            <label className="form-label">Make</label>
                                            <input type="text" name="make" className="form-control editForm-not-editable" placeholder="Make" value={productDetails?.make} readOnly="readOnly" />
                                        </div>
                                    </div>}
                                    {productDetails?.model && <div className="col-sm-6 col-md-6">
                                        <div className="form-group">
                                            <label className="form-label">Model</label>
                                            <input type="text" name="model" className="form-control" value={productDetails?.model} placeholder="Model" onChange={handleChange} />
                                        </div>
                                    </div>}
                                    {productDetails?.year && <div className="col-sm-6 col-md-6">
                                        <div className="form-group">
                                            <label className="form-label">Year</label>
                                            <input type="number" name="year" className="form-control" value={productDetails?.year} placeholder="Year" onChange={handleChange} />
                                        </div>
                                    </div>}
                                    {productDetails?.kmsDriven && <div className="col-sm-6 col-md-6">
                                        <div className="form-group">
                                            <label className="form-label">KMs Driven</label>
                                            <input type="number" name="kmsDriven" className="form-control" value={productDetails?.kmsDriven} placeholder="KMs Driven" onChange={handleChange} />
                                        </div>
                                    </div>}
                                    {productDetails?.fuelType && <div className="col-sm-6 col-md-6">
                                        <div className="form-group">
                                            <label className="form-label">Fuel Type</label>
                                            <input type="text" name="fuelType" className="form-control editForm-not-editable" title="You can not change fuel type" value={productDetails?.fuelType} placeholder="Fuel Type" readOnly="readOnly" />
                                        </div>
                                    </div>}
                                    {productDetails?.floorLevel && <div className="col-sm-6 col-md-6">
                                        <div className="form-group">
                                            <label className="form-label">Floor Level</label>
                                            <input type="number" name="floorLevel" className="form-control" value={productDetails?.floorLevel} placeholder="Floor Level" onChange={handleChange} />
                                        </div>
                                    </div>}
                                    {/* {productDetails?.areaUnit && <div className="col-sm-6 col-md-6">
                                        <div className="form-group">
                                            <label className="form-label">Area Unit</label>
                                            <input type="text" name="fuelType" className="form-control editForm-not-editable" title="You can not change fuel type" value={productDetails?.fuelType} placeholder="Fuel Type" readOnly="readOnly" />
                                        </div>
                                    </div>} */}
                                    {productDetails?.area && productDetails?.areaUnit && <div className="col-sm-6 col-md-6">
                                        <div className="form-group">
                                            <label className="form-label">Area</label>
                                            <input type="text" className="form-control editForm-not-editable" title="You can not change area" value={productDetails?.area + " " + productDetails?.areaUnit} placeholder="Area" readOnly="readOnly" />
                                        </div>
                                    </div>}
                                    {productDetails?.price && <div className="col-sm-6 col-md-6">
                                        <div className="form-group">
                                            <label className="form-label">Price</label>
                                            <input type="text" value={productDetails?.price} title="You can not change product price" style={{ cursor: "not-allowed", textTransform: "capitalize" }} className="form-control" placeholder="Price" readOnly="readOnly" />
                                        </div>
                                    </div>}
                                    {productDetails?.category && <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-label">Category</label>
                                            <input type="text" className="form-control" style={{ cursor: "not-allowed" }} value={productDetails?.category} placeholder="Category" name="category" readOnly="readOnly" />
                                        </div>
                                    </div>}
                                    {productDetails?.subCategory && <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-label">Sub-Category</label>
                                            <input type="text" className="form-control" style={{ cursor: "not-allowed" }} value={productDetails?.subCategory} placeholder="Sub-Category" name="subCategory" readOnly="readOnly" />
                                        </div>
                                    </div>}
                                    {productDetails?.location && <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-label">Location</label>
                                            <input type="text" className="form-control editForm-not-editable" value={productDetails?.location?.city + ", " + productDetails?.location?.province} placeholder="Location" readOnly="readOnly" />
                                        </div>
                                    </div>}

                                    {productDetails?.bidTime && <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-label">Auction Live Days</label>
                                            <input type="text" className="form-control editForm-not-editable" value={productDetails?.bidTime + " Days"} placeholder="Bid Time" readOnly="readOnly" />
                                        </div>
                                    </div>}
                                    {productDetails?.endDate && <div className="col-md-6">
                                        <div className="form-group">
                                            <label className="form-label">Auction End Date</label>
                                            <input type="text" className="form-control editForm-not-editable" value={moment(productDetails?.endDate).format("DD-MMM-yyyy")} placeholder="Auction End Date" readOnly="readOnly" />
                                        </div>
                                    </div>}

                                    {productDetails?.description && <div className="col-md-12">
                                        <div className="form-group">
                                            <label className="form-label">Description</label>
                                            <textarea rows="10" className="form-control" placeholder="Enter product description" name="description" value={productDetails?.description} onChange={handleChange}></textarea>
                                        </div>
                                    </div>}

                                </div>
                            </div>
                            <div className="card-footer">
                                <button type="submit" className="btn btn-primary">
                                    Update Product
                                </button>
                                <button
                                    className="btn btn-info mx-1"
                                    onClick={() => {
                                        navigate("/Dashboard");
                                    }}>
                                    Go Back
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            }
        </>
    );
};

export default EditProfille;
