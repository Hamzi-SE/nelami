import React, { useState } from 'react';
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';
import customFetch from '../../../utils/api';

const Settings = () => {
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
            toast.success("Password Updated Successfully");
            navigate("/", { replace: true });
        } else {
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
                                    Update Password
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