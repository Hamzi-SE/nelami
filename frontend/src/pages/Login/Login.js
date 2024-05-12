import React, { useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import MetaData from "../../utils/MetaData";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../Components/Loader/Loader";
import customFetch from "../../utils/api";

const Login = () => {
  const { loading } = useSelector(state => state.user);
  const dispatch = useDispatch();
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
      }),
    });

    const data = await res.json();

    if (res.status === 200) {
      dispatch({ type: "LOGIN_USER_SUCCESS", payload: data.user })

      toast.success("Logged In Successfully");
      navigate("/", { replace: true });
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
      <MetaData title="Login - Nelami" />
      {/* <!--Breadcrumb Section--> */}
      <section>
        <div className="bannerimg cover-image bg-background3" data-bs-image-src="../assets/images/banners/banner2.jpg">
          <div className="header-text mb-0">
            <div className="container">
              <div className="text-center text-white ">
                <h1 className="">Login</h1>
                <ol className="breadcrumb text-center">
                  <li className="breadcrumb-item">
                    <Link to="/">Home</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="/products">Pages</Link>
                  </li>
                  <li className="breadcrumb-item active text-white" aria-current="page">
                    Login
                  </li>
                </ol>
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
                      <div className="card-header">
                        <h3 className="card-title">Login to your Account</h3>
                      </div>
                      <div className="card-body">
                        {/* <div className="text-center">
                          <div className="btn-group btn-block mt-2 mb-2">
                            <a href="https://www.facebook.com/" className="btn btn-facebook active">
                              <i className="fa-brands fa-facebook-f"></i>
                            </a>
                            <a href="https://www.facebook.com/" className="btn btn-block btn-facebook">
                              Facebook
                            </a>
                          </div>
                          <div className="btn-group btn-block mt-2 mb-2">
                            <a href="https://www.google.com/gmail/" className="btn btn-google active">
                              <i className="fa-brands fa-google"></i>
                            </a>
                            <a href="https://www.google.com/gmail/" className="btn btn-block btn-google">
                              Google
                            </a>
                          </div>
                        </div> */}
                        {/* <hr className="divider" /> */}
                        <div className="form-group">
                          <label className="form-label text-dark">Email address</label>
                          <input type="email" className="form-control" placeholder="Enter email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label className="form-label text-dark">Password</label>
                          <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className="form-group">
                          <label className="custom-control form-checkbox">
                            <Link to="/user/forgot-password" className="float-end small text-dark mt-1">
                              Forgot Password?
                            </Link>
                            <input type="checkbox" className="custom-control-input" />
                            <span className="custom-control-label text-dark">Remember me</span>
                          </label>
                        </div>
                        <div className="form-footer mt-2">
                          <button type="submit" className="btn btn-primary btn-block" onClick={handleSubmit}>
                            Login
                          </button>
                        </div>
                        <div className="text-center  mt-3 text-dark">
                          Don't have account yet? <Link to="/Signup">Sign Up</Link>
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

export default Login;
