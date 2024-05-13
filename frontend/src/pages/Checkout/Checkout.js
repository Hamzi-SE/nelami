import React, { useEffect, useRef, useState } from "react";
import { AiOutlineCalendar } from 'react-icons/ai';
import { BsCreditCard, BsKey } from 'react-icons/bs';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from "../../Components/Loader/Loader";

import MetaData from "../../utils/MetaData";

import {
    CardCvcElement,
    CardExpiryElement,
    CardNumberElement,
    useElements,
    useStripe,
} from "@stripe/react-stripe-js";

import { callProfile } from "../../helpers/CallProfile";
import customFetch from "../../utils/api";
import "./checkout.css";
// import { createOrder, clearErrors } from "../../actions/orderAction";

const Checkout = () => {
    const navigate = useNavigate();
    const orderPackage = useSelector(state => state.package.package)
    const orderPrice = useSelector(state => state.package.price)
    const orderId = useSelector(state => state.package.packageId)
    const orderDescription = useSelector(state => state.package.description)

    const [checkoutFormLoading, setCheckoutFormLoading] = useState(true)
    const { loading } = useSelector(state => state.payment)
    const userLoading = useSelector(state => state.user.loading)
    const dispatch = useDispatch();
    const stripe = useStripe();
    const elements = useElements();
    const payBtn = useRef(null);

    //   const { shippingInfo, cartItems } = useSelector((state) => state.cart);
    const { user, isAuthenticated } = useSelector((state) => state.user);
    //   const { error } = useSelector((state) => state.newOrder);

    const paymentData = {
        id: orderId,
        // amount: Math.round(orderPrice * 100),
        // amount: 10000 * 100,
    };

    // const order = {
    //     shippingInfo,
    //     orderItems: cartItems,
    //     itemsPrice: orderInfo.subtotal,
    //     taxPrice: orderInfo.tax,
    //     shippingPrice: orderInfo.shippingCharges,
    //     totalPrice: orderInfo.totalPrice,
    // };

    const order = {
        userPlan: orderPackage
    }

    const handlePlanUpgrade = async (e) => {
        try {
            const res = await customFetch("/api/v1/upgradePlan", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(order),
            });
            const data = await res.json()
            if (res.status === 200) {
                dispatch({ type: "PLAN_PAYMENT_SUCCESS" });
                callProfile(dispatch);      //Reload User Data
                navigate("/packages")
                toast.success("Plan upgraded successfully")
            } else if (res.status === 400) {
                toast.error(data.message)
            }
            else {
                console.log("ERROR in upgrading plan")
            }
        } catch (error) {
            console.log(error?.response?.data?.message);
        }
    }



    const submitHandler = async (e) => {
        e.preventDefault();

        payBtn.current.disabled = true;
        dispatch({ type: "PLAN_PAYMENT_REQUEST" })
        try {

            const res = await customFetch("/api/v1/payment/process", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    paymentData
                })
            });
            const data = await res.json()
            if (res.status === 400) {
                dispatch({ type: "PLAN_PAYMENT_FAIL", payload: "Payment Failed" })
                toast.error(data.message)
                return;
            }

            const client_secret = data.client_secret;

            if (!stripe || !elements) return;

            const result = await stripe.confirmCardPayment(client_secret, {
                payment_method: {
                    card: elements.getElement(CardNumberElement),
                    billing_details: {
                        name: user.name,
                        email: user.email,
                        phone: user.phoneNo,
                        address: {
                            city: user.city,
                        }
                    },
                },
            });

            if (result.error) {
                dispatch({ type: "PLAN_PAYMENT_FAIL", payload: result.error.message })
                payBtn.current.disabled = false;
                toast.error(result.error.message);
            } else {
                if (result.paymentIntent.status === "succeeded") {
                    order.paymentInfo = {
                        id: result.paymentIntent.id,
                        status: result.paymentIntent.status,
                    };
                    handlePlanUpgrade();
                    dispatch({ type: "PLAN_PAYMENT_SUCCESS" });
                } else {
                    dispatch({ type: "PLAN_PAYMENT_FAIL", payload: "Payment Failed" })
                    toast.error("There's some issue while processing payment ");
                }
            }
        } catch (error) {
            dispatch({ type: "PLAN_PAYMENT_FAIL", payload: "Payment Failed" })
            payBtn.current.disabled = false;
            toast.error(error);
        }
    };

    useEffect(() => {
        if (userLoading) {
            <Loader />
        }
        if (!userLoading && !isAuthenticated) {
            toast.warning(`Please Login to upgrade your plan`)
            navigate("/packages")
            return;
        }
        if (!orderPackage || !orderPrice) {
            navigate("/packages")
            toast.warning(`Please select a package`)
            return;
        }
        setCheckoutFormLoading(false)
    }, [userLoading, isAuthenticated, orderPackage, orderPrice, navigate])


    return (
        <>
            <MetaData title="Payment" />

            {checkoutFormLoading ? <Loader /> : <div className="container">
                <div className="py-5 text-center">
                    <img className="d-block mx-auto mb-4 w-auto" src="https://i.postimg.cc/q7LJxFWx/3c03db78-b11b-46a7-a3e0-e45762a7b991.jpg" alt="" width="72" height="72" />
                    <h2>Checkout form</h2>
                    <p className="lead">Enter your details below</p>
                    <hr />
                </div>

                <div className="row">
                    <div className="col-md-5 order-md-2 mb-4">

                        <ul className="list-group mb-3">
                            <li className="list-group-item d-flex justify-content-between lh-condensed">
                                <div>

                                    <b className="my-0">Plan</b>
                                    <h6>- {orderPackage}</h6>
                                    <b className="mt-3">Description</b>
                                    <ul className="list-unstyled mt-0 mb-0">
                                        {orderDescription.split("\n").map((item, index) => {
                                            return <li key={index}>- {item}</li>
                                        })}
                                    </ul>
                                </div>
                                <span className="text-muted">Rs. {orderPrice}</span>
                            </li>

                            <li className="list-group-item d-flex justify-content-between">
                                <span><b>Total (PKR)</b></span>
                                <strong>Rs. {orderPrice}</strong>
                            </li>
                        </ul>

                        <div className="paymentContainer">
                            <form className="paymentForm" onSubmit={(e) => submitHandler(e)}>
                                {/* <Typography>Card Info</Typography> */}

                                {/* Card Payment Heading */}
                                <div className="paymentHeading">
                                    <h2>Card Information</h2>
                                </div>
                                <div>
                                    <BsCreditCard />
                                    <CardNumberElement className="paymentInput" />
                                </div>
                                <div>
                                    <AiOutlineCalendar />
                                    <CardExpiryElement className="paymentInput" />
                                </div>
                                <div>
                                    <BsKey />
                                    <CardCvcElement className="paymentInput" />
                                </div>

                                <input
                                    type="submit"
                                    value={`${loading ? "Processing..." : `Pay - Rs.${orderPrice}`}`}
                                    ref={payBtn}
                                    className="paymentFormBtn"
                                />
                            </form>
                        </div>
                    </div>
                    <div className="col-md-7 order-md-1">
                        <h4 className="mb-3">User Details</h4>
                        <form className="needs-validation" noValidate>
                            <div className="row">
                                <div className="col-12 mb-3">
                                    <label htmlFor="firstName">Name</label>
                                    <input type="text" className="form-control" id="firstName" placeholder="Enter Your Name" value={user?.name} required />

                                </div>

                            </div>



                            <div className="mb-3">
                                <label htmlFor="email">Email</label>
                                <input type="email" className="form-control" id="email" value={user?.email} placeholder="you@example.com" />

                            </div>

                            <div className="mb-3">
                                <label htmlFor="address">Address</label>
                                <input type="text" className="form-control" id="address" value={`${user?.address} - ${user?.city}`} placeholder="1234 Main St" required />

                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="country">Country</label>
                                    <select className="custom-select d-block w-100" id="country" required>
                                        <option value="Pakistan">Pakistan</option>
                                    </select>

                                </div>
                                <div className="col-md-6 mb-3">
                                    <label htmlFor="state">City</label>
                                    <select className="custom-select d-block w-100" id="state" required>
                                        <option value={user?.city}>{user?.city}</option>
                                    </select>

                                </div>

                            </div>





                        </form>
                    </div>
                </div>

            </div>
            }



        </>
    );
};


export default Checkout;