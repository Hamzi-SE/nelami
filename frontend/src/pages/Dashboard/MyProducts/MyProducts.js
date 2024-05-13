import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { toastOptions } from "../../../App";
import DataTable from "react-data-table-component";

import "./MyProducts.css"

// Icons
import { HiOutlinePencilAlt, HiOutlineTrash, HiOutlineEye } from "react-icons/hi"
import customFetch from '../../../utils/api';

const MyProducts = () => {

    const navigate = useNavigate();
    const [allProducts, setAllProducts] = useState([])
    const [filteredProducts, setFilteredProducts] = useState([])
    const [search, setSearch] = useState("")
    const [pending, setPending] = useState(true)

    const callUserProducts = async () => {
        const res = await customFetch("/api/v1/products/me/all", {
            method: "GET",
            "Content-Type": "application/json",
        });
        try {
            const data = await res.json();
            if (res.status === 200) {
                setAllProducts(data.products);
                setFilteredProducts(data.products);
                setPending(false)
            } else {
                toast.error(data.message, toastOptions);
                navigate("/Dashboard");
            }
        } catch (error) {
            console.log(error);
        }
    }



    useEffect(() => {
        callUserProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);




    const columns = [
        {
            name: "Image",
            selector: (row) => <img src={row.images.featuredImg.url} width={100} alt="productImg" />
        },
        {
            name: "Product Name",
            selector: (row) => row.title
        },
        {
            name: "Category",
            selector: row => row.category
        },

        {
            name: "Price(Rs)",
            selector: row => row.price
        },
        {
            name: "Status",
            selector: row => row.bidStatus,
            conditionalCellStyles: [
                {
                    when: row => row.bidStatus === "Live",
                    style: {

                        color: 'green',
                        fontWeight: 'bold',
                        fontSize: '17px',

                    },

                },
                // You can also pass a callback to style for additional customization
                {
                    when: row => row.bidStatus === "Expired",
                    style: {
                        color: 'red',
                        fontWeight: 'bold',
                        fontSize: '17px',

                    },
                },
            ],
        },
        {
            name: "Actions",
            cell: (row, i) => (
                <>

                    <button type="button" data-icon="edit" data-index={i} className="btn btn-sm btn-primary" onClick={() => navigate(`/user/product/edit/${row._id}`)} >
                        <HiOutlinePencilAlt />
                    </button>
                    <button type="button" data-icon="delete" data-index={i} className="btn btn-sm btn-primary" onClick={() => navigate(`/user/product/delete/${row._id}`)}>
                        <HiOutlineTrash />
                    </button>
                    <button type="button" data-icon="view" data-index={i} className="btn btn-sm btn-primary" onClick={() => window.open(`${process.env.REACT_APP_URL}/product/` + row._id, "_blank")}>
                        <HiOutlineEye />
                    </button>
                    <button type="button" data-icon="bidders" data-index={i} className="btn btn-sm btn-primary" onClick={() => window.open(`${process.env.REACT_APP_URL}/user/product/bids/all/` + row._id, "_blank")}>
                        <i className="fa-solid fa-user-group"></i>
                    </button>
                </>
            ),
        },
    ]


    useEffect(() => {
        const result = allProducts?.filter((product) => {
            return product.title.toLowerCase().match(search.toLowerCase())
        }).sort((a, b) => {
            return a.title.localeCompare(b.title)
        })
        setFilteredProducts(result);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search])



    const filterProducts = (attribute, value) => {
        const result = allProducts?.filter((product) => {
            return product[attribute] === value
        }).sort((a, b) => {
            return a.title.localeCompare(b.title)
        })
        setFilteredProducts(result);
    }


    const handleFilterBtnClick = (e) => {
        const selectedBtn = e.currentTarget.dataset.filter;

        switch (selectedBtn) {
            case "allProducts":
                setFilteredProducts(allProducts)
                setSearch("");
                break;

            case "live":
                filterProducts("bidStatus", "Live");
                break;

            case "expired":
                filterProducts("bidStatus", "Expired");
                break;

            case "vehicles":
                filterProducts("category", "Vehicles");
                break;

            case "properties":
                filterProducts("category", "Property");
                break;

            case "miscProducts":
                filterProducts("category", "MiscProducts");
                break;
            default:
                break;

        }
    }


    return (
        <>
            <div className="col-xl-9 col-lg-12 col-md-12">
                <div className="card mb-0">
                    <div className="card-header">
                        <h3 className="card-title">My Products</h3>
                    </div>
                    <div className="card-body">
                        <div className="row">

                            <div className="filter-btns mb-3">
                                <button data-filter="allProducts" className="btn btn-primary" onClick={handleFilterBtnClick}> All Products </button>
                                {/* <button data-filter="featured" className="btn btn-primary" onClick={handleFilterBtnClick}> Featured </button> */}
                                <button data-filter="live" className="btn btn-primary" onClick={handleFilterBtnClick}> Live  </button>
                                <button data-filter="expired" className="btn btn-primary" onClick={handleFilterBtnClick}> Expired </button>
                                <button data-filter="vehicles" className="btn btn-primary" onClick={handleFilterBtnClick}> Vehicles </button>
                                <button data-filter="properties" className="btn btn-primary" onClick={handleFilterBtnClick}> Properties </button>
                                <button data-filter="miscProducts" className="btn btn-primary" onClick={handleFilterBtnClick}> Misc Products </button>
                            </div>


                            <DataTable columns={columns}
                                data={filteredProducts}
                                pagination={true}
                                progressPending={pending}
                                subHeader
                                subHeaderComponent={<input type='text' placeholder='Search Here' className='w-25 form-control' value={search}
                                    onChange={(e) => setSearch(e.target.value)} />}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MyProducts;