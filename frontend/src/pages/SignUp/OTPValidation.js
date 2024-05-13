import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../Components/Loader/Loader";
import MetaData from "../../utils/MetaData";
import customFetch from "../../utils/api";

const OTPValidation = () => {
  const { loading } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // get email from query string (http://localhost:3000/user/validate?email=ffawad@giulieano.xyz)

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get('email');

  const [otp, setOtp] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !otp) {
      toast.error("Please Fill All Fields");
      return;
    }

    // dispatch({ type: "LOGIN_USER_REQUEST" })

    const res = await customFetch("/api/v1/OTPValidation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        otp,
      }),
    });

    const data = await res.json();
    

    if (res.status === 200) {
        dispatch({ type: "SIGNUP_USER_SUCCESS", payload: data.user})

      toast.success("Email Verified Successfully");
      navigate("/dashboard", { replace: true });
      window.scrollTo(0, 0);
    } else {
    //   dispatch({ type: "LOGIN_USER_FAIL", payload: data.message })
      toast.error(data.message);
    }
  };

  if (loading) {
    return <Loader />
  }

  return (
    <>
      <MetaData title="OTP Validation - Nelami" />
      {/* <!--Breadcrumb Section--> */}
      <section>
        <div className="bannerimg cover-image bg-background3" data-bs-image-src="../assets/images/banners/banner2.jpg">
          <div className="header-text mb-0">
            <div className="container">
              <div className="text-center text-white ">
                <h1 className="">OTP Validation</h1>
                <ol className="breadcrumb text-center">
                  <li className="breadcrumb-item">
                    <Link to="/">Home</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="/otp-validation">OTP Validation</Link>
                  </li>
                  <li className="breadcrumb-item active text-white" aria-current="page">
                    OTP Validation
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!--/Breadcrumb Section--> */}

      {/* <!--OTP Validation-Section--> */}
      <section className="sptb">
        <div className="container customerpage">
          <form method="POST">
            <div className="row">
              <div className="col-lg-4 d-block mx-auto">
                <div className="row">
                  <div className="col-xl-12 col-md-12 col-md-12">
                    <div className="card mb-0">
                      <div className="card-header">
                        <h3 className="card-title">OTP Validation to your Account</h3>
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
                          <label className="form-label text-dark">OTP</label>
                          <input type="number" className="form-control" placeholder="OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
                        </div>

                        <div className="form-footer mt-2">
                          <button type="submit" className="btn btn-primary btn-block" onClick={handleSubmit}>
                            Validate
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
      {/* <!--/OTP Validation-Section--> */}
    </>
  );
};

export default OTPValidation;
