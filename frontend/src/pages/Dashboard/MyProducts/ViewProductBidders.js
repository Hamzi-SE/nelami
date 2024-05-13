import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { toastOptions } from "../../../App";
import { BsChatSquareText } from "react-icons/bs";
import { useParams } from "react-router-dom";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useSelector, useDispatch } from "react-redux";
import Loader from "../../../Components/Loader/Loader";
import generateId from "../../../utils/RandomIdGen";
import customFetch from "../../../utils/api";


const ViewProductBidders = () => {
    const { user } = useSelector(state => state.user);
    const { loading } = useSelector(state => state.bids);

    const [bidders, setBidders] = useState([]);
    const { product } = useSelector(state => state.singleProduct);
    const productLoading = useSelector(state => state.singleProduct.loading);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();



    const callUserProduct = async () => {
        dispatch({ type: "SINGLE_PRODUCT_REQUEST" })
        const res = await customFetch(`/api/v1/products/${id}`, {
            method: "GET",
            "Content-Type": "application/json",
        });
        try {
            const data = await res.json();
            if (res.status === 200) {
                dispatch({ type: "SINGLE_PRODUCT_SUCCESS", payload: data.product })
            } else {
                dispatch({ type: "SINGLE_PRODUCT_FAIL", payload: data.message })
                toast.error(data.message, toastOptions);
                navigate("/");
            }
        } catch (error) {
            dispatch({ type: "SINGLE_PRODUCT_FAIL", payload: error })
            console.log(error);
        }

    }


    const getBidders = async () => {
        dispatch({ type: "PRODUCT_BIDS_REQUEST" })
        try {
            const res = await customFetch(`/api/v1/bid/product/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await res.json();
            if (res.status === 200) {

                dispatch({ type: "PRODUCT_BIDS_SUCCESS", payload: data.bids })
                if (data.bids[0]?.bidders) {
                    let arrayForSort = [...data.bids[0].bidders]
                    arrayForSort.sort((a, b) => (b.price - a.price))
                    setBidders(arrayForSort)
                }
            } else {
                dispatch({ type: "PRODUCT_BIDS_FAIL", payload: data.message })
                toast.error(data.message, toastOptions);
                navigate("/");
            }

        } catch (error) {
            dispatch({ type: "PRODUCT_BIDS_FAIL", payload: error.message })
            console.log(error);
        }

    }

    useEffect(() => {
        callUserProduct();
        getBidders();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);












    const startConversation = async (id) => {
        // setLoading(true);
        const res = await customFetch(`/api/v1/conversations`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                senderId: user?._id,
                receiverId: id,
            })
        })
        const data = await res.json();

        if (res.status === 201) {
            document.getElementsByClassName("modal-backdrop")[0].remove();
            toast.success(data.message)
        } else if (res.status === 200) {
            document.getElementsByClassName("modal-backdrop")[0].remove();
            toast.success(data.message)

        } else {
            document.getElementsByClassName("modal-backdrop")[0].remove();
            toast.error(data.message)
        }

        navigate(`/messenger`, { replace: true })

        // setLoading(false);
    }




    if (loading || productLoading) {
        return <Loader />
    }

    return (
        <>

            {product &&
                <div className="col-xl-9 col-lg-12 col-md-12 my-5 mx-auto">
                    <div className="card mb-0">
                        <div className="card-header">
                            <h1 className="card-title">
                                <strong>Product Bidders</strong>
                            </h1>
                        </div>

                        <div className="card-body text-center item-user">

                            <h3 className="mt-3 mb-0 font-weight-semibold">{product.title}</h3>
                            <h3 className="mt-3 mb-0 font-weight-semibold text-success" style={{ textTransform: "capitalize" }}>
                                {product.bidStatus}
                            </h3>

                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="container mt-3 bg-white px-2 py-3">
                                    <div>
                                        <h5>
                                            <b>Bidders</b>
                                        </h5>
                                    </div>
                                    <div style={{ height: "300px", overflowY: "scroll" }} className="col-md-12 col-sm-12 col-lg-12">
                                        <ul className="unorder-list mt-4">
                                            <li>
                                                {bidders.length !== 0 ? bidders.sort((a, b) => b?.price - a?.price)?.map((user, idx) => {

                                                    return (
                                                        <React.Fragment key={generateId()}>

                                                            {/* <!-- Modal --> */}
                                                            <div key={generateId()} className="modal fade" id={`chatModal-${idx}`} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                                <div className="modal-dialog" role="document">
                                                                    <div className="modal-content">
                                                                        <div className="modal-header">
                                                                            <h5 className="modal-title" id="exampleModalLabel">
                                                                                <div className="user-wrapper">
                                                                                    <img src={user?.user?.avatar?.url} alt={user?.user?.name} className="avatar-small" />
                                                                                    <h3>{user?.user?.name}</h3>
                                                                                </div>
                                                                            </h5>
                                                                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                                                <span aria-hidden="true">&times;</span>
                                                                            </button>
                                                                        </div>
                                                                        <div className="modal-body">
                                                                            Do you want to start a chat with {user?.user?.name} ?
                                                                        </div>
                                                                        <div className="modal-footer">
                                                                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
                                                                            <button type="button" className="btn btn-primary" onClick={() => startConversation(user?.user?._id)}>Yes</button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>



                                                            <div key={generateId()} className="bidder-data d-flex my-3">
                                                                <div className="userindex smallcol">
                                                                    <span >{idx + 1}</span> </div>
                                                                <div className="userimg smallcol">
                                                                    <img className="bidder-dp" src={user?.user?.avatar?.url} alt="user" />
                                                                </div>
                                                                <span className="username largecol"> {user?.user?.name} </span>
                                                                <span className=" m-auto largecol">{user?.user?.phoneNo}</span>
                                                                <div className="price largecol"><b>Rs. {user?.price}</b></div>
                                                                <span className="price largecol">
                                                                    <Tippy content="Chat With User">
                                                                        <button style={{ border: "none", background: "white", fontSize: "17px" }} data-toggle="modal" data-target={`#chatModal-${idx}`}><BsChatSquareText /></button>
                                                                    </Tippy>
                                                                </span>
                                                            </div>
                                                        </React.Fragment>
                                                    )
                                                }) :
                                                    <h4>No Bids On this Product Yet</h4>
                                                }
                                            </li>
                                        </ul>
                                    </div>

                                </div>

                            </div>
                        </div>
                        <div className="card-footer">
                            <button
                                className="btn btn-info mx-1"
                                onClick={() => { user?.role === "admin" ? navigate("/admin/dashboard") : navigate("/dashboard") }}>
                                Go Back
                            </button>
                        </div>
                    </div>
                </div>
            }

        </>
    );
};

export default ViewProductBidders;
