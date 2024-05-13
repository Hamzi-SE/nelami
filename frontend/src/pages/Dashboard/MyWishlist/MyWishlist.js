import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { HiOutlineEye } from 'react-icons/hi';
import { FaHeart } from "react-icons/fa";

import { toastOptions } from '../../../App';
import './MyWishlist.css'
import customFetch from '../../../utils/api';
import Loader from '../../../Components/Loader/Loader';

const MyWishlist = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [wishlist, setUserWishlist] = useState([]);

    const addToWishlistHandler = async (id) => {
        setLoading(true)
        const res = await customFetch(`/api/v1/addToWishlist`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                productId: id
            })
        })
        const data = await res.json();

        if (res.status === 200) {
            toast.warning(data.message)

        }
        else if (res.status === 201) {
            toast.success(data.message)

        }
        else {
            toast.error(data.message)
        }
        setLoading(false)
    }


    const callUserWishlist = async () => {
        const res = await customFetch("/api/v1/getWishlist", {
            method: "GET",
            "Content-Type": "application/json",
        });
        try {
            const data = await res.json();
            
            if (res.status === 200) {
                setUserWishlist(data.products);
            } else {
                toast.error(data.message, toastOptions);
                navigate("/Dashboard");
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        callUserWishlist();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading]);

    if (loading) {
        return <Loader />
    }




    const columns = [
        {
            name: "Product Image",
            selector: (row) => <img src={row.images?.featuredImg.url} width={120} alt="productImg" />
        },
        {
            name: "Product Name",
            selector: (row) => row.title
        },
        {
            name: "Product Price",
            selector: (row) => "Rs. " + row.price
        },
        {
            name: "Product Link",
            cell: (row, i) => (
                <>
                    <button type="button" className="btn btn-sm btn-primary" style={{ fontSize: "1.5em" }} onClick={() => { navigate(`/Product/${row._id}`) }}>
                        <HiOutlineEye />
                    </button>
                    <button type="button" className="btn btn-sm btn-primary" style={{ fontSize: "1.5em", marginLeft: "0.5em" }} onClick={() => { addToWishlistHandler(row._id) }}>
                        <FaHeart />
                    </button>
                </>
            )
        },


    ]

    return (
        <>
            <div className="col-xl-9 col-lg-12 col-md-12">
                <div className="card mb-0">
                    <div className="card-header">
                        <h3 className="card-title">My Wishlist</h3>
                    </div>
                    <div className="card-body">
                        <div className="row">

                            {wishlist ? (<DataTable columns={columns} data={wishlist} />)
                                : "You haven't added any product to your wishlist"
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MyWishlist