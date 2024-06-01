import React, { useEffect, useState } from "react";
import "./CategoryPage.css"
import { useParams } from "react-router-dom";
import ProductCard from "../../Components/ProductCard/ProductCard";
import MetaData from "../../utils/MetaData";
import Pagination from "react-js-pagination";
import customFetch from "../../utils/api";
import Loader from "../../Components/Loader/Loader";


const CategoryPage = () => {
    const [loading, setLoading] = useState(true);

    const { category } = useParams();


    const [products, setProducts] = useState([]);

    const [resultsPerPage, setResultsPerPage] = useState(12);
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredTotalProducts, setFilteredTotalProducts] = useState(0);

    const setCurrentPageNo = (e) => {
        setCurrentPage(e)
    }


    useEffect(() => {
        const getAllProducts = async () => {
            let link = `/api/v1/products?category=${category}&page=${currentPage}`;

            setLoading(true);
            const res = await customFetch(link, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            })
            const data = await res.json();
            setResultsPerPage(data.resultsPerPage);
            setFilteredTotalProducts(data.filteredProductsCount)
            setProducts(data.products);
            setLoading(false);
        }
        getAllProducts();
    }, [category, currentPage])


    if (loading) {
        return <Loader />
    }

    return (
        <>
            <MetaData title={`${category} - Nelami`} />
            <div className="header-2">
                <div className="banner-1 cover-image sptb-2 bg-background">
                    <div className="header-text1 mb-0">
                        <div className="container">
                            <div className="row">
                                <div className="col-xl-8 col-lg-12 col-md-12 d-block mx-auto">
                                    <div className="text-center text-white">
                                        <h1 className="">

                                            {category}
                                        </h1>
                                    </div>



                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <!-- /header-text --> */}
                </div>
            </div>
            {/* <!--/Sliders Section--> */}

            {/* <!--Breadcrumb--> */}
            {/* <div className="bg-white border-bottom">
        <div className="container">
          <div className="page-header">
            <h4 className="page-title">Ad List Right</h4>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="#">Home</a>
              </li>
              <li className="breadcrumb-item">
                <a href="#">Pages</a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Ad List Right
              </li>
            </ol>
          </div>
        </div>
      </div> */}
            {/* <!--/Breadcrumb--> */}
            {/* 
    <!--Add listing--> */}
            {products ? (<section className="sptb">
                <div className="container">
                    <div className="row">

                        {/* <!--Add Lists--> */}
                        <div className="col-xl-12 col-lg-12 col-md-12 m-auto">
                            <div className="card mb-0">
                                <div className="card-body">
                                    <div className="item2-gl">
                                        <div className="item2-gl-nav d-flex">
                                            <h6 className="mb-0 mt-2">Showing 1 to 10 of {filteredTotalProducts} entries</h6>
                                            {/* <ul className="nav item2-gl-menu ms-auto">
                        <li className="">
                          <a href="#tab-11" className="" data-bs-toggle="tab" title="List style">
                            <i className="fa fa-list"></i>
                          </a>
                        </li>
                        <li>
                          <a href="#tab-12" data-bs-toggle="tab" className="active show" title="Grid">
                            <i className="fa fa-th"></i>
                          </a>
                        </li>
                      </ul> */}
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
                                                {products.length !== 0 ? products.map((product, index) => {

                                                    return <div key={index} className="product-wrapper col-lg-4 col-md-6 col-sm-12">
                                                        <ProductCard product={product} />
                                                    </div>
                                                }) : <h1 className="text-center">No Products Found</h1>}

                                            </div>
                                        </div>
                                    </div>

                                    {/* <div className="center-block text-center">
                                        <ul className="pagination mb-0">
                                            <li className="page-item page-prev disabled">
                                                <a className="page-link" href="#" tabIndex="-1">
                                                    Prev
                                                </a>
                                            </li>
                                            <li className="page-item active">
                                                <a className="page-link" href="#">
                                                    1
                                                </a>
                                            </li>
                                            <li className="page-item">
                                                <a className="page-link" href="#">
                                                    2
                                                </a>
                                            </li>
                                            <li className="page-item">
                                                <a className="page-link" href="#">
                                                    3
                                                </a>
                                            </li>
                                            <li className="page-item page-next">
                                                <a className="page-link" href="#">
                                                    Next
                                                </a>
                                            </li>
                                        </ul>
                                    </div> */}

                                </div>
                            </div>
                        </div>
                        {/* <!--/Add Lists--> */}
                    </div>
                </div>
            </section>) : "No Products Found"
            }

            <div className="paginationBox">
                <Pagination activePage={currentPage}
                    itemsCountPerPage={resultsPerPage}
                    totalItemsCount={filteredTotalProducts}
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
            </div>

            {/* <!--/Add Listing--> */}


        </>
    )
}

export default CategoryPage