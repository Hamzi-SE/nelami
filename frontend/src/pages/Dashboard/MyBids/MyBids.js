import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { HiOutlineEye } from 'react-icons/hi';
import { toastOptions } from '../../../App';
import { useSelector, useDispatch } from 'react-redux'
import './MyBids.css'
import customFetch from '../../../utils/api';

const MyBids = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading } = useSelector(state => state.bids);
    const [userBids, setUserBids] = useState([]);

    const callUserBids = async () => {
        dispatch({ type: "BUYER_ALL_BIDS_REQUEST" })
        const res = await customFetch("/api/v1/bids/user", {
            method: "GET",
            "Content-Type": "application/json",
        });
        try {
            const data = await res.json();
            if (res.status === 200) {
                dispatch({ type: "BUYER_ALL_BIDS_SUCCESS", payload: data.bids })
                setUserBids(data.bids);

            } else {
                dispatch({ type: "BUYER_ALL_BIDS_FAIL", payload: data.message })
                toast.error(data.message, toastOptions);
                navigate("/Dashboard");
            }
        } catch (error) {
            dispatch({ type: "BUYER_ALL_BIDS_FAIL", payload: error })
            console.log(error);
        }
    }



    useEffect(() => {
        callUserBids();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const columns = [
        {
            name: "Product Image",
            selector: (row) => <img src={row.bidItem?.images?.featuredImg.url} width={120} alt="productImg" />
        },
        {
            name: "Product Name",
            selector: (row) => row.bidItem?.title
        },
        {
            name: "Product Price",
            selector: (row) => "Rs. " + row.bidItem?.price
        },
        {
            name: "Product Link",
            cell: (row, i) => (
                <>

                    <button type="button" className="btn btn-sm btn-primary" style={{ fontSize: "1.5em" }} onClick={() => { navigate(`/Product/${row.bidItem?._id}`) }}>
                        <HiOutlineEye />
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
                        <h3 className="card-title">My Bids</h3>
                    </div>
                    <div className="card-body">
                        <div className="row">

                            {userBids ? (<DataTable columns={columns} data={userBids} progressPending={loading} />)
                                : "You haven't bidded on any product yet"
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MyBids