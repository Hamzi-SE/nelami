import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ProductCard from "../../Components/ProductCard/ProductCard";
import { useSelector, useDispatch } from "react-redux";
import Pagination from "react-js-pagination";
import CountUp from "react-countup";
import "./ProductsPage.css";

//Cities Import

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
import MetaData from "../../utils/MetaData";
import Loader from "../../Components/Loader/Loader";
import customFetch from "../../utils/api";

const ProductsPage = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, products } = useSelector(state => state.products);
    const { data } = useSelector(state => state.data)
    //get all queries from url
    const [searchParams] = useSearchParams();

    const [city, setCity] = useState(searchParams.get("city"));
    const [province, setProvince] = useState(searchParams.get("province"));
    const [category, setCategory] = useState(searchParams.get("category") || "");
    const [keyword, setKeyword] = useState(searchParams.get("keyword"));


    const [fromPrice, setFromPrice] = useState("");
    const [toPrice, setToPrice] = useState("");

    const [resultsPerPage, setResultsPerPage] = useState(12);
    const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get("page")) || 1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [filteredTotalProducts, setFilteredTotalProducts] = useState(0);
    const [getParamCategory, setGetParamCategory] = useState(searchParams.get("category") || "");

    const getAllSearchProducts = async () => {
        dispatch({ type: "ALL_PRODUCTS_REQUEST" });
        try {
            let link = `/api/v1/products?page=${currentPage}`;
            if (keyword) {
                link += `&keyword=${keyword}`;
            }
            if (category) {
                link.includes("?") ? link += "&" : link += "?"
                link += `category=${category}`;
            }
            if (province) {
                link.includes("?") ? link += "&" : link += "?"
                link += `province=${province}`;
            }
            if (province && city) {
                link.includes("?") ? link += "&" : link += "?"
                link += `city=${city}`;
            }
            if (fromPrice) {
                link += `&price[gte]=${fromPrice}`;
            }
            if (toPrice) {
                link += `&price[lte]=${toPrice}`;
            }

            const res = await customFetch(link, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            updateUrl();
            const data = await res.json();
            dispatch({ type: "ALL_PRODUCTS_SUCCESS", payload: data.products });
            setResultsPerPage(data.resultsPerPage);
            setTotalProducts(data.productsCount);
            setFilteredTotalProducts(data.filteredProductsCount)

        } catch (error) {
            dispatch({ type: "ALL_PRODUCTS_FAIL", payload: error.message });
        }

    }

    const updateUrl = () => {
        let link = `/products?page=${currentPage}`;
        if (keyword) {
            link += `?keyword=${keyword}`
          }
        if (province) {
          link.includes("?") ? link += "&" : link += "?"
          link += `province=${province}`
        } if (category) {
          link.includes("?") ? link += "&" : link += "?"
          link += `category=${category}`
        }
        if (province && city) {
            link.includes("?") ? link += "&" : link += "?"
            link += `city=${city}`;
        }
        if (fromPrice) {
            link += `&price[gte]=${fromPrice}`;
        }
        if (toPrice) {
            link += `&price[lte]=${toPrice}`;
        }
        navigate(link)
    }


    const setCurrentPageNo = (e) => {
        setCurrentPage(e)
    }

    useEffect(() => {
        getAllSearchProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage])


    useEffect(() => {
        setGetParamCategory(searchParams.get("category") || "");
    }, [searchParams])

    if (loading) {
        return <Loader />
    }

    const startIndex = (currentPage - 1) * resultsPerPage;
    const endIndex = currentPage * resultsPerPage;

    return (
        <>
            <MetaData title="Search Results - Nelami" />
            {/* <!--Sliders Section--> */}
            <div className="header-2">
                <div className="banner-1 cover-image sptb-2 bg-background">
                    <div className="header-text1 mb-0">
                        <div className="container">
                            <div className="row">
                                <div className="col-12 mx-auto">
                                    <div className="text-center text-white">
                                        <h1 className="">
                                            <span className="font-weight-bold"><CountUp duration={0.8} end={totalProducts} useEasing={true} /></span> Auctions Running {getParamCategory ? `In ${getParamCategory}` : ""} Right Now on Nelami
                                        </h1>
                                    </div>

                                    <div className="search-background mb-0">
                                        <div className="form row g-0 header-search-input">

                                            <div className="form-group">
                                                <input type="text" className="form-control input-lg border-end-0" value={keyword ? keyword : ""} id="text" placeholder="Search Products" onChange={(e) => setKeyword(e.target.value)} />
                                            </div>
                                            <div className="form-group">
                                                <select value={category} className="form-control select2-show-search border-bottom-0 w-100 product-page-category-search-option" data-placeholder="Select Category"
                                                    onChange={async (e) => {
                                                        setCategory(e.target.value)
                                                    }}  >
                                                    <optgroup label="Categories">
                                                        <option value="">Select Category</option>
                                                        <option value="Vehicles">Vehicles</option>
                                                        <option value="Property">Properties</option>
                                                        <option value="MiscProducts">Miscellaneous Products</option>
                                                    </optgroup>
                                                </select>
                                            </div>
                                            {/* PRONVINCES LIST */}
                                            <div className="form-group">
                                                <select id="province" name="province" value={province ? province : ""} onChange={(e) => setProvince(e.target.value)} className="form-control select2-show-search border-bottom-0 w-100 product-page-category-search-option" data-placeholder="Select" required>
                                                    <option value="">Select Province</option>
                                                    {getProvinceDropList(data)}
                                                </select>
                                            </div>


                                            {/* Islamabad CITIES DROPLIST */}
                                            {province === "Islamabad" && (
                                                <div className="form-group">
                                                    <select id="islamabad-sectors" name="city" value={(province && city) ? city : ""} onChange={(e) => setCity(e.target.value)} className="form-control select2-show-search border-bottom-0 w-100 product-page-category-search-option" required>
                                                        <option value="">
                                                            Select Sector
                                                        </option>
                                                        {getIslamabadSectorsDropList(data)}
                                                    </select>
                                                </div>
                                            )}

                                            {/* PUNJAB CITIES DROPLIST */}
                                            {province === "Punjab" && (
                                                <div className="form-group">
                                                    <select id="punjab-cities" name="city" value={city ? city : ""} onChange={(e) => setCity(e.target.value)} className="form-control select2-show-search border-bottom-0 w-100 product-page-category-search-option" required>
                                                        <option value="">
                                                            Select City
                                                        </option>
                                                        {getPunjabCitiesDropList(data)}
                                                    </select>
                                                </div>
                                            )}
                                            {/* KPK CITIES DROPLIST */}
                                            {province === "Khyber Pakhtunkhwa" && (
                                                <div className="form-group">
                                                    <select id="kpk-cities" name="city" value={city ? city : ""} onChange={(e) => setCity(e.target.value)} className="form-control select2-show-search border-bottom-0 w-100 product-page-category-search-option" required>
                                                        <option value="">
                                                            Select City
                                                        </option>
                                                        {getKPKCitiesDropList(data)}
                                                    </select>
                                                </div>
                                            )}
                                            {/* Sindh CITIES DROPLIST */}
                                            {province === "Sindh" && (
                                                <div className="form-group">
                                                    <select id="sindh-cities" name="city" value={city ? city : ""} onChange={(e) => setCity(e.target.value)} className="form-control select2-show-search border-bottom-0 w-100 product-page-category-search-option" required>
                                                        <option value="">
                                                            Select City
                                                        </option>
                                                        {getSindhCitiesDropList(data)}
                                                    </select>
                                                </div>
                                            )}
                                            {/* Balochistan CITIES DROPLIST */}
                                            {province === "Balochistan" && (
                                                <div className="form-group">
                                                    <select id="balochistan-cities" name="city" value={city ? city : ""} onChange={(e) => setCity(e.target.value)} className="form-control select2-show-search border-bottom-0 w-100 product-page-category-search-option" required>
                                                        <option value="">
                                                            Select City
                                                        </option>
                                                        {getBalochistanCitiesDropList(data)}
                                                    </select>
                                                </div>
                                            )}
                                            {/* Azad Kashmir CITIES DROPLIST */}
                                            {province === "Azad Kashmir" && (
                                                <div className="form-group">
                                                    <select id="AzadKashmir-cities" name="city" value={city ? city : ""} onChange={(e) => setCity(e.target.value)} className="form-control select2-show-search border-bottom-0 w-100 product-page-category-search-option" required>
                                                        <option value="">
                                                            Select City
                                                        </option>
                                                        {getAzadKashmirCitiesDropList(data)}
                                                    </select>
                                                </div>
                                            )}
                                            {/* Northern Areas CITIES DROPLIST */}
                                            {province === "Northern Areas" && (
                                                <div className="form-group">
                                                    <select id="northern-areas-cities" name="city" value={city ? city : ""} onChange={(e) => setCity(e.target.value)} className="form-control select2-show-search border-bottom-0 w-100 product-page-category-search-option" required>
                                                        <option value="">
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


            {/*  <!--Add listing--> */}
            <section className="sptb">
                <div className="container">
                    <div className="row">

                        {/* <!--Left Side Content--> */}
                        <div className="col-xl-3 col-lg-4 col-md-12">

                            <div className="card">


                                <div className="card-header border-top">
                                    <h3 className="card-title">Price Range</h3>
                                </div>
                                <div className="card-body px-5">
                                    <div id="mySlider" className="d-flex">
                                        <input type="number" placeholder="From Rs." value={fromPrice} onChange={(e) => setFromPrice(e.target.value)} className="form-range border" id="customRange1" />
                                        <input type="number" placeholder="To Rs." value={toPrice} onChange={(e) => setToPrice(e.target.value)} className="form-range border" id="customRange2" />
                                    </div>
                                </div>


                                <div className="card-footer">
                                    <button className="btn btn-secondary btn-block" onClick={getAllSearchProducts}>
                                        Apply Filter
                                    </button>
                                </div>
                            </div>

                        </div>
                        {/* <!--/Left Side Content--> */}


                        {/* <!--Add Lists--> */}
                        <div className="col-xl-9 col-lg-8 col-md-12">
                            <div className="card mb-0">
                                <div className="card-body">
                                    <div className="item2-gl">
                                        <div className="item2-gl-nav d-flex">

                                            {getParamCategory ? <h6 className="mb-0 mt-2">Showing {filteredTotalProducts} to {filteredTotalProducts} entries from <b>{getParamCategory}</b></h6> : <h6 className="mb-0 mt-2">Showing {startIndex + 1} to {endIndex} entries</h6>}
                                            <div className="d-flex select2-sm">
                                                <label className="me-2 mt-1 mb-sm-1 w-100">Sort By:</label>
                                                <select name="item" className="form-control select2 w-70">
                                                    <option value="1">Latest</option>
                                                    <option value="2">Oldest</option>
                                                    <option value="3">Price:Low-to-High</option>
                                                    <option value="5">Price:Hight-to-Low</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="tab-content">
                                            <div className="row products-page-products-wrapper">
                                                {
                                                    products?.length !== 0 ? products?.map((product, index) => {

                                                        return <div key={index} className="product-wrapper col-lg-4 col-md-6 col-sm-12">

                                                            <ProductCard product={product} index={index} />

                                                        </div>
                                                    }) : <h3 className="w-100 text-center">
                                                        No Products Matched Your Search
                                                    </h3>}

                                            </div>
                                        </div>
                                    </div>
                                    { products?.length !== 0 && <div className="paginationBox">
                                        <Pagination activePage={currentPage}
                                            itemsCountPerPage={resultsPerPage}
                                            totalItemsCount={totalProducts}
                                            onChange={setCurrentPageNo}
                                            nextPageText="Next"
                                            prevPageText="Prev"
                                            firstPageText="1st"
                                            lastPageText="Last"
                                            itemClass="page-item"
                                            linkClass="page-link-pagination"
                                            activeClass="pageItemActive"
                                            activeLinkClass="pageLinkActive"
                                        />
                                    </div>}
                                </div>
                            </div>
                        </div>
                        {/* <!--/Add Lists--> */}
                    </div>
                </div>
            </section>
            {/* <!--/Add Listing--> */}
        </>
    );
};

export default ProductsPage;
