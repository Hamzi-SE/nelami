import React, { useState } from 'react'
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import MetaData from '../../utils/MetaData';
import { useDispatch, useSelector } from "react-redux";
import customFetch from '../../utils/api';

const ResetPassword = () => {
    const { loading } = useSelector(state => state.forgotPassword);
    const dispatch = useDispatch();

    const navigate = useNavigate();
    const { token } = useParams();


    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = async () => {

        if (!password || !confirmPassword) {
            return toast.error("Please Fill All Fields");
        }
        dispatch({ type: "RESET_PASSWORD_REQUEST" })

        const res = await customFetch(`/api/v1/password/reset/${token}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                password, confirmPassword
            }),
        });

        const data = await res.json();

        if (res.status === 200) {
            dispatch({ type: "RESET_PASSWORD_SUCCESS", payload: data.message })
            dispatch({ type: "LOAD_USER_SUCCESS", payload: data.user })
            toast.success(data.message);
            navigate("/", { replace: true });
        } else {
            dispatch({ type: "RESET_PASSWORD_FAIL", payload: data.message })
            toast.error(data.message);
        }
    };


    return (
        <>
            <MetaData title="Reset Password - Nelami" />
            <div className="col-xl-12 col-lg-12 col-md-12">
                <div className="card mb-0">

                    <div className="card-body m-5">
                        <div className=" d-flex justify-content-center align-items-center flex-column row">
                            <h1>Reset Your Password</h1>

                            <div className="col-sm-6 col-md-6">
                                <div className="form-group">
                                    <label className="form-label">New Password</label>
                                    <input type="text" className="form-control" name="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter Your New Password" />
                                </div>
                            </div>

                            <div className="col-sm-6 col-md-6">
                                <div className="form-group">
                                    <label className="form-label">Confirm Password</label>
                                    <input type="text" className="form-control" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Your New Password" />
                                </div>
                            </div>

                            <div className="form-footer mt-2">
                                <button type="submit" className="btn btn-primary btn-block" onClick={handleSubmit}>
                                    {loading ? "Loading..." : "Reset Password"}
                                </button>
                            </div>




                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ResetPassword