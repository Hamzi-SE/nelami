import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import MetaData from "../../utils/MetaData";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../Components/Loader/Loader";
import customFetch from "../../utils/api";

const AdminLogin = () => {
    const dispatch = useDispatch();
    const { loading } = useSelector(state => state.user);

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error("Please Fill All Fields");
            return;
        }
        dispatch({ type: "LOGIN_USER_REQUEST" })

        const res = await customFetch("/api/v1/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
                person: "admin",
            }),
        });

        const data = await res.json();

        if (res.status === 200) {
            dispatch({ type: "LOGIN_USER_SUCCESS", payload: data.user })

            toast.success("Admin Logged In Successfully");
            navigate("/admin/Dashboard", { replace: true });
            window.scrollTo(0, 0);
        } else {
            dispatch({ type: "LOGIN_USER_FAIL", payload: data.message })
            toast.error(data.message);
        }
    };

    if (loading) {
        return <Loader />
    }


    return (
        <>
            <MetaData title="Admin Login - Nelami" />
            {/* <!--Breadcrumb Section--> */}
            <section>
                <div className="bannerimg cover-image bg-background3" data-bs-image-src="../assets/images/banners/banner2.jpg">
                    <div className="header-text mb-0">
                        <div className="container">
                            <div className="text-center text-white ">
                                <h1 className="">Admin Login</h1>

                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* <!--/Breadcrumb Section--> */}

            {/* <!--Login-Section--> */}
            <section className="sptb">
                <div className="container customerpage">
                    <form method="POST">
                        <div className="row">
                            <div className="col-lg-4 d-block mx-auto">
                                <div className="row">
                                    <div className="col-xl-12 col-md-12 col-md-12">
                                        <div className="card mb-0">
                                            <div className="card-header d-flex justify-content-center">
                                                <h3 className="card-title"><b>Login</b></h3>
                                            </div>
                                            <div className="card-body">

                                                <div className="form-group">
                                                    <label className="form-label text-dark">Email address</label>
                                                    <input type="email" className="form-control" placeholder="Enter email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                                </div>
                                                <div className="form-group">
                                                    <label className="form-label text-dark">Password</label>
                                                    <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                                </div>

                                                <div className="form-footer mt-2">
                                                    <button type="submit" className="btn btn-primary btn-block" onClick={handleSubmit}>
                                                        Login
                                                    </button>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </section>
            {/* <!--/Login-Section--> */}
        </>
    );
};

export default AdminLogin;
