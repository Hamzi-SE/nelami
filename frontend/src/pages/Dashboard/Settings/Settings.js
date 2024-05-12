import React, { useState } from 'react';
import { toast } from "react-toastify";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import "./Settings.css";
import customFetch from '../../../utils/api';
const Settings = () => {
    const { loading } = useSelector(state => state.profile);
    const { user } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const [userPasswords, setUserPasswords] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    })

    const handleChange = async (e) => {
        setUserPasswords({ ...userPasswords, [e.target.name]: e.target.value });
    };

    const updatePassword = async () => {

        const { oldPassword, newPassword, confirmPassword } = userPasswords;

        if (!oldPassword || !newPassword || !confirmPassword) {
            return toast.error("Please Fill All Fields");
        }
        dispatch({ type: "UPDATE_PASSWORD_REQUEST" })

        const res = await customFetch("/api/v1/password/update", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                oldPassword, newPassword, confirmPassword
            }),
        });

        const data = await res.json();

        if (res.status === 200) {
            dispatch({ type: "UPDATE_PASSWORD_SUCCESS", payload: "Password Updated Successfully" })
            toast.success("Password Updated Successfully");
            navigate("/", { replace: true });
        } else {
            dispatch({ type: "UPDATE_PASSWORD_FAIL", payload: data.message })
            toast.error(data.message);
        }
    };

    return (
        <>
            <div className="col-xl-9 col-lg-12 col-md-12">
                <div className="card mb-0">
                    <div className="card-header">
                        <h3 className="card-title">Settings</h3>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            {/* Link to Packages Page */}
                            {user?.role === "seller" && <><h3 className="card-title">Upgrade Package</h3>
                                <div className="col-md-12">
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-md-7">
                                                    <div className="form-group m-0">
                                                        <label>Current Package</label>
                                                        <input type="text" className={`form-control seller-current-package-input ${user?.userPackage === "Platinum" ? "platinum" : user.userPackage === "Gold" ? "gold" : "black"}`} disabled value={user?.userPackage} />
                                                    </div>
                                                </div>
                                                <div className="col-md-3 seller-upgrade-package-div">
                                                    <div className="form-group m-0">
                                                        <Link to="/packages"><button className='form-control seller-upgrade-package-button'>Upgrade Package</button></Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>}
                            <h3 className="card-title">Reset Password</h3>
                            <div className="col-sm-12 col-md-12">
                                <div className="form-group">
                                    <label className="form-label">Current Password</label>
                                    <input type="text" className="form-control" name="oldPassword" onChange={handleChange} placeholder="Your Current Password" />
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-12">
                                <div className="form-group">
                                    <label className="form-label">New Password</label>
                                    <input type="text" placeholder="Your New Password" name="newPassword" onChange={handleChange} className="form-control" />
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-12">
                                <div className="form-group">
                                    <label className="form-label">Confirm Password</label>
                                    <input type="email" placeholder="Confirm New Password" name="confirmPassword" onChange={handleChange} className="form-control" />
                                </div>
                            </div>
                            <div className="card-footer">
                                <button type="submit" className="btn btn-primary" onClick={updatePassword}>
                                    {loading ? "Updating..." : "Update Password"}
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Settings