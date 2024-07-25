import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getAllCitiesDropList } from "../../utils/PakCitiesData";
import { useSelector, useDispatch } from "react-redux";

import MetaData from "../../utils/MetaData";
import Loader from "../../Components/Loader/Loader";
import customFetch from "../../utils/api";

const SignUp = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.user)
  const { data } = useSelector(state => state.data);
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    phoneNo: "",
    role: "",
    city: "",
  });

  // const [avatar, setAvatar] = useState(""); //->fileInputState
  // const [previewSource, setPreviewSource] = useState("");

  // const previewFile = async (file) => {
  //   const reader = new FileReader();
  //   reader.readAsDataURL(file);
  //   reader.onloadend = () => {
  //     setPreviewSource(reader.result);
  //     setAvatar(reader.result);
  //   };
  // };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    if (name === "name") {
      const result = value.replace(/[^a-zA-Z ]/gi, "");
      setUser({ ...user, name: result });
    } else if (name === "phoneNo") {
      // Allow only digits to be inputted
      if (value === "" || /^[0-9\b]+$/.test(value)) {
        setUser({ ...user, [name]: value });
      }
    } else {
      setUser({ ...user, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password, confirmPassword, address, phoneNo, role, city, store } = user;

    if (!name || !email || !password || !confirmPassword || !phoneNo || !role) {
      toast.error("Please Fill All Fields");
      return;
    }
    dispatch({ type: "SIGNUP_USER_REQUEST" })

    const res = await customFetch("/api/v1/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        phoneNo,
        password,
        confirmPassword,
        address,
        city,
        role,
        store,
        // avatar,
      }),
    });

    const data = await res.json();

    if (res.status === 201) {
      dispatch({ type: "OTP_SENT_SUCCESS", payload: data })
      toast.success(data.message);

      navigate(`/user/validate?email=${email}`, { replace: true });
    } else {
      dispatch({ type: "SIGNUP_USER_FAIL", payload: data.message })
      toast.error(data.message);
    }
    // navigate("/login");
  };


  if (loading) {
    return <Loader />
  }

  return (
    <>
      <MetaData title="Sign Up - Nelami" />
      {/* <!--Breadcrumb--> */}
      <section>
        <div className="bannerimg cover-image bg-background3" data-bs-image-src="../assets/images/banners/banner2.jpg">
          <div className="header-text mb-0">
            <div className="container">
              <div className="text-center text-white ">
                <h1 className="">Register</h1>
                <ol className="breadcrumb text-center">
                  <li className="breadcrumb-item">
                    <Link to="/">Home</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="/">Pages</Link>
                  </li>
                  <li className="breadcrumb-item active text-white" aria-current="page">
                    Register
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!--/Breadcrumb--> */}

      {/* <!--Register-section--> */}
      <section className="sptb">
        <div className="container customerpage">
          <div className="row ">
            <div className="col-lg-4 d-block mx-auto">
              <div className="row">
                <div className="col-xl-12 col-md-12 col-md-12">
                  <form method="POST" encType="multipart/form-data" onSubmit={handleSubmit}>
                    <div className="card mb-xl-0">
                      <div className="card-header">
                        <h3 className="card-title">Register</h3>
                      </div>
                      <div className="card-body">
                        <div className="form-group">
                          <label className="form-label text-dark">Name</label>
                          <input type="text" className="form-control" placeholder="Enter Name" name="name" value={user.name} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                          <label className="form-label text-dark">Email address</label>
                          <input type="email" className="form-control" placeholder="Enter Email" name="email" value={user.email} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                          <label className="form-label text-dark">Password</label>
                          <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Enter Password" name="password" value={user.password} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                          <label className="form-label text-dark">Confirm Password</label>
                          <input type="password" className="form-control" id="exampleInputPassword2" placeholder="Confirm Password" name="confirmPassword" value={user.confirmPassword} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                          <label className="form-label text-dark">Phone No.</label>
                          <input type="text" className="form-control" id="exampleInputPhone" placeholder="Enter Phone Number" minLength={11} maxLength={15} name="phoneNo" value={user.phoneNo} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                          <label className="form-label text-dark">City</label>
                          {/* <input type="text" className="form-control" id="exampleInputCity" placeholder="Enter City" name="city" value={user.city} onChange={handleChange} /> */}
                          <select id="Location" className="form-control" onChange={(e) => setUser({ ...user, city: e.target.value })} name="city" value={user.city} required>
                            <option value="" disabled>
                              Select The City
                            </option>
                            {getAllCitiesDropList(data)}
                          </select>
                        </div>
                        <div className="form-group" required>
                          <div className="form-check">
                            <input className="form-check-input" type="radio" name="role" value="buyer" id="role-buyer" onChange={handleChange} checked={user.role === 'buyer'} />
                            <label className="form-check-label" htmlFor="role-buyer">
                              Buyer
                            </label>
                          </div>
                          <div className="form-check">
                            <input className="form-check-input" type="radio" name="role" value="seller" id="role-seller" onChange={handleChange} checked={user.role === 'seller'} />
                            <label className="form-check-label" htmlFor="role-seller">
                              Seller
                            </label>
                          </div>
                        </div>
                        {user.role === "seller" && (
                        <div className="form-group">
                          <label className="form-label text-dark">Address</label>
                          <input type="text" className="form-control" id="exampleInputAddress" placeholder="Enter Address" name="address" value={user.address} onChange={handleChange} />
                        </div>
                        )}

                        {user.role === "seller" && (
                          <div className="form-group">
                            <label className="form-label text-dark">Store Name</label>
                            <input type="text" className="form-control" id="exampleInputStore" placeholder="Store Name" name="store" value={user.store} onChange={handleChange} />
                          </div>
                        )}

                        {/* <div className="form-group">
                          <label className="form-label text-dark">Profile Pic</label>
                          <input type="file" name="avatar" onChange={handleChange} className="form-control" />
                        </div> */}

                        {/* <div className="form-group">
                          <label className="custom-control form-checkbox">
                            <input type="checkbox" className="custom-control-input" />
                            <span className="custom-control-label text-dark">
                              Agree the <a href="#">terms and policy</a>
                            </span>
                          </label>
                        </div> */}
                        <div className="form-footer mt-2">
                          <button type="submit" className="btn btn-primary btn-block">
                            Create New Account
                          </button>
                        </div>
                        <div className="text-center  mt-3 text-dark">
                          Already have account?<Link to="/Login">Sign In</Link>
                        </div>
                      </div>
                    </div>
                  </form>
                  {/* {avatar && <img src={avatar} alt="dp" style={{ height: "300px" }} />} */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!--Register-section--> */}
    </>
  );
};

export default SignUp;
