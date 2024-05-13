import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

//Components
import DataTable from "react-data-table-component";

//MISC
import { toast } from "react-toastify";
import { toastOptions } from "../../../App";

// Icons
import { HiOutlineTrash, HiOutlineEye } from "react-icons/hi"
import { FiUsers } from 'react-icons/fi'
import customFetch from '../../../utils/api';


const AllProducts = () => {
    const { loading } = useSelector(state => state.products);
    const dispatch = useDispatch();

    const navigate = useNavigate()
    const [allProducts, setAllProducts] = useState([])
    const [filteredProducts, setFilteredProducts] = useState([])
    const [search, setSearch] = useState("")



    useEffect(() => {
        const getAllProducts = async () => {
            dispatch({ type: "ADMIN_PRODUCTS_REQUEST" })
            try {
                const res = await customFetch(`/api/v1/productsAdmin`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                const data = await res.json();
                if (res.status === 200) {
                    dispatch({ type: "ADMIN_PRODUCTS_SUCCESS", payload: data.products })
                    setAllProducts(data.products)
                    setFilteredProducts(data.products)
                } else {
                    dispatch({ type: "ADMIN_PRODUCTS_FAIL", payload: data.message })
                    toast.error(data.message, toastOptions);
                    navigate("/Dashboard");
                }
            } catch (error) {
                dispatch({ type: "ADMIN_PRODUCTS_FAIL", payload: error })
                console.log(error);
            }
        }

        getAllProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])





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
            name: "Sub Category",
            selector: row => row.subCategory
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

                    {/* <button type="button" data-index={i} className="btn btn-sm btn-primary" >
                        <HiOutlinePencilAlt />
                    </button> */}
                    <button type="button" data-icon="view" data-index={i} className="btn btn-sm btn-primary" onClick={() => window.open('/Product/' + row._id, "_blank")}>
                        <HiOutlineEye />
                    </button>

                    <button type="button" data-icon="delete" data-index={i} className="btn btn-sm btn-primary" onClick={() => navigate(`/user/product/delete/${row._id}`)}>
                        <HiOutlineTrash />
                    </button>

                    <button type="button" data-icon="bidders" data-index={i} className="btn btn-sm btn-primary" onClick={() => navigate(`/user/product/bids/all/${row._id}`)}>
                        <FiUsers />
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




    // if (loading) {
    //     return (
    //         <>
    //             <div className="container-fluid loading-three-dots ">
    //                 <ThreeDots color="blue" height={80} width={80} />
    //             </div>
    //         </>
    //     )
    // }



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
                                <button data-filter="allProducts" className="btn btn-primary" onClick={handleFilterBtnClick}> All Products <span>{allProducts.length}</span></button>
                                {/* <button data-filter="featured" className="btn btn-primary" onClick={handleFilterBtnClick}> Featured </button> */}
                                <button data-filter="live" className="btn btn-primary" onClick={handleFilterBtnClick}> Live <span>{allProducts.filter((product) => product.bidStatus === "Live").length}</span> </button>
                                <button data-filter="expired" className="btn btn-primary" onClick={handleFilterBtnClick}> Expired <span>{allProducts.filter((product) => product.bidStatus === "Expired").length}</span></button>
                                <button data-filter="vehicles" className="btn btn-primary" onClick={handleFilterBtnClick}> Vehicles <span>{allProducts.filter((product) => product.category === "Vehicles").length}</span></button>
                                <button data-filter="properties" className="btn btn-primary" onClick={handleFilterBtnClick}> Properties <span>{allProducts.filter((product) => product.category === "Property").length}</span></button>
                                <button data-filter="miscProducts" className="btn btn-primary" onClick={handleFilterBtnClick}> Misc Products <span>{allProducts.filter((product) => product.category === "MiscProducts").length}</span></button>
                            </div>
                            <DataTable
                                columns={columns}
                                data={filteredProducts}
                                pagination={true}
                                striped={true}
                                highlightOnHover={true}
                                progressPending={loading}
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

export default AllProducts