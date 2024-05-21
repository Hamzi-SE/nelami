import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { toastOptions } from "../../../App";
import { useDispatch, useSelector } from "react-redux";
import customFetch from "../../../utils/api";
import { getAllCitiesDropList } from "../../../utils/PakCitiesData";

const EditProfille = () => {
  const { loading } = useSelector(state => state.profile);
  const { data } = useSelector(state => state.data);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    phoneNo: "",
    address: "",
    city: "",
    store: "",
    aboutInfo: "",
    avatar: null,
  });

  const [avatar, setAvatar] = useState(""); //->fileInputState

  const previewFile = async (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      // setPreviewSource(reader.result);
      setAvatar(reader.result);
    };
  };

  const handleChange = async (e) => {
    if (e.target.name === "avatar") {
      const file = e.target.files[0];
      previewFile(file);
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  const callProfile = async () => {
    const res = await customFetch("/api/v1/me", {
      method: "GET",
      "Content-Type": "application/json",
    });
    try {
      const data = await res.json();
      if (res.status === 200) {
        setUser(data.user);
      } else {
        toast.error(data.message, toastOptions);
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async (e) => {
    dispatch({ type: "UPDATE_PROFILE_REQUEST" });
    const { name, address, phoneNo, city, store, aboutInfo } = user;
    const res = await customFetch("/api/v1/me/update", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        address,
        phoneNo,
        city,
        store,
        aboutInfo,
        avatar,
      }),
    });
    const data = await res.json();
    
    if (res.status === 200) {
      dispatch({ type: "UPDATE_PROFILE_SUCCESS" });
      dispatch({ type: "LOAD_USER_SUCCESS", payload: data.user });
      toast.success("Profile Updated Successfully", toastOptions);
      navigate("/Dashboard");
    } else {
      dispatch({ type: "UPDATE_PROFILE_FAIL", payload: data.message });
      toast.error(data.message, toastOptions);
    }
  };

  useEffect(() => {
    callProfile();
    window.scrollTo(0, 0);
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className="col-xl-9 col-lg-12 col-md-12 my-5 mx-auto">
        <div className="card mb-0">
          <div className="card-header">
            <h1 className="card-title">
              <strong>Edit Your Profile</strong>
            </h1>
          </div>
          <div className="card-body text-center item-user">
            <div className="profile-pic">
              <div className="profile-pic-img">
                <span className="bg-success dots" data-bs-toggle="tooltip" data-bs-placement="top" title="" data-bs-original-title="online"></span>
                {user.avatar && <img src={user.avatar.url} className="brround" alt="user" />}
              </div>
              <h3 className="mt-3 mb-0 font-weight-semibold">{user.name}</h3>
              <h3 className="mt-3 mb-0 font-weight-semibold text-success" style={{ textTransform: "capitalize" }}>
                {user.role}
              </h3>
            </div>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-sm-6 col-md-6">
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input type="text" className="form-control" placeholder="Name" name="name" value={user.name} onChange={handleChange} />
                </div>
              </div>
              <div className="col-sm-6 col-md-6">
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <input type="text" title="You can not change your role" style={{ cursor: "not-allowed", textTransform: "capitalize" }} className="form-control" placeholder="Role" value={user.role} readOnly="readOnly" />
                </div>
              </div>
              <div className="col-sm-6 col-md-6">
                <div className="form-group">
                  <label className="form-label">Email address</label>
                  <input type="email" title="You can not change your email" style={{ cursor: "not-allowed" }} className="form-control" placeholder="Email" value={user.email} readOnly="readOnly" />
                </div>
              </div>
              <div className="col-sm-6 col-md-6">
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input type="text" className="form-control" placeholder="Number" name="phoneNo" value={user.phoneNo} onChange={handleChange} />
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-group">
                  <label className="form-label">Address</label>
                  <input type="text" className="form-control" placeholder="Home Address" name="address" value={user.address} onChange={handleChange} />
                </div>
              </div>
              <div className="col-sm-6 col-md-6">
                <div className="form-group">
                  <label className="form-label">City</label>
                  {/* <input type="text" className="form-control" placeholder="City" value={user.city} /> */}
                  <select name="city" id="Location" className="form-control" onChange={(e) => setUser({ ...user, city: e.target.value })} value={user.city} required>
                    <option value="">
                      Select The City
                    </option>
                    {getAllCitiesDropList(data)}
                  </select>
                </div>
              </div>

              {user.role === "seller" && (
                <div className="col-sm-6 col-md-6">
                  <div className="form-group">
                    <label className="form-label">Store Name</label>
                    <input type="text" className="form-control" placeholder="Store Name" name="store" value={user.store} onChange={handleChange} />
                  </div>
                </div>
              )}

              {user.role === "seller" && (
                <div className="col-md-12">
                  <div className="form-group">
                    <label className="form-label">About Me</label>
                    <textarea rows="5" className="form-control" placeholder="Enter About your description" name="aboutInfo" value={user.aboutInfo} onChange={handleChange}></textarea>
                  </div>
                </div>
              )}
              <div className="col-md-12">
                <div className="form-group mb-0">
                  <label className="form-label">Change Profile Image</label>
                  <div className="control-group form-group">
                    <div className="input-group">
                      <input className="form-control" name="avatar" type="file" onChange={handleChange} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card-footer">
            <button type="submit" className="btn btn-primary" onClick={handleUpdate}>
              {loading ? "Updating..." : "Update"}
            </button>
            <button
              className="btn btn-info mx-1"
              onClick={() => {
                navigate("/Dashboard");
              }}>
              Go Back
            </button>
          </div>
        </div>
      </div>
      {avatar && <img src={avatar} alt="dp" style={{ height: "300px" }} />}
    </>
  );
};

export default EditProfille;
