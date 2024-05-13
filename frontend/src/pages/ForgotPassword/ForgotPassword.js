import React, { useState } from 'react';
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";
import MetaData from '../../utils/MetaData';
import { useDispatch, useSelector } from "react-redux";
import customFetch from '../../utils/api';

const ForgotPassword = () => {
    const { loading } = useSelector(state => state.forgotPassword);
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            return toast.error("Please Enter Your Email");
        }

        dispatch({ type: "FORGOT_PASSWORD_REQUEST" })

        const res = await customFetch("/api/v1/password/forgot", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email
            }),
        });

        const data = await res.json();
        
        if (res.status === 200) {
            dispatch({ type: "FORGOT_PASSWORD_SUCCESS", payload: data.message })
            toast.success(data.message);
            navigate("/", { replace: true });
        } else {
            dispatch({ type: "FORGOT_PASSWORD_FAIL", payload: data.message })
            toast.error(data.message + ` With ${email}`);
        }
    };

    return (
        <>
            <MetaData title="Forgot Password - Nelami" />
            <div className="col-xl-12 col-lg-12 col-md-12">
                <div className="card mb-0">

                    <div className="card-body forgot-card-body">
                        <form onSubmit={handleSubmit}>
                            <div className=" d-flex justify-content-center align-items-center flex-column row">


                                <h1>Forgot Your Password?</h1>
                                <h5>To reset your password, please enter your registered email.</h5><br />
                                <h6>We will send the password reset instructions to the email address associated with this account.</h6>
                                <div className="col-sm-6 col-md-6">
                                    <div className="form-group">
                                        <label className="form-label">Email</label>
                                        <input type="email" required className="form-control" name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter Your Email" />
                                    </div>
                                </div>

                                <div className="form-footer mt-2">
                                    <button type="submit" className="btn btn-primary btn-block" >
                                        {loading ? "Sending..." : "Submit"}
                                    </button>
                                </div>

                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ForgotPassword