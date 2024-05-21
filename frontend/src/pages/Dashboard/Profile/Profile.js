import React from 'react';
import { Link } from 'react-router-dom';

const Profile = (props) => {
  const { user } = props;
  return (
    <>
      <div className="col-xl-9 col-lg-12 col-md-12">
        <div className="card mb-0">
          <div className="card-header">
            <h3 className="card-title">Profile</h3>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-sm-6 col-md-6">
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input type="text" className="form-control" placeholder="Name" value={user.name} readOnly="readOnly" />
                </div>
              </div>
              <div className="col-sm-6 col-md-6">
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <input type="text" className="form-control" placeholder="Role" style={{ textTransform: "capitalize" }} value={user.role} readOnly="readOnly" />
                </div>
              </div>
              <div className="col-sm-6 col-md-6">
                <div className="form-group">
                  <label className="form-label">Email address</label>
                  <input type="email" className="form-control" placeholder="Email" value={user.email} readOnly="readOnly" />
                </div>
              </div>
              <div className="col-sm-6 col-md-6">
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input type="text" className="form-control" placeholder="Number" value={user.phoneNo} readOnly="readOnly" />
                </div>
              </div>
              <div className="col-md-12">
                <div className="form-group">
                  <label className="form-label">Address</label>
                  <input type="text" className="form-control" placeholder="Home Address" value={user.address} readOnly="readOnly" />
                </div>
              </div>
              <div className="col-sm-6 col-md-6">
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input type="text" className="form-control" placeholder="City" value={user.city} readOnly="readOnly" />
                </div>
              </div>

              {user.role === "seller" && (
                <div className="col-sm-6 col-md-6">
                  <div className="form-group">
                    <label className="form-label">Store Name</label>
                    <input type="text" className="form-control" placeholder="Store Name" name="store" value={user.store} />
                  </div>
                </div>
              )}

              {user.role === "seller" && (
                <div className="col-md-12">
                  <div className="form-group">
                    <label className="form-label">About Me</label>
                    <textarea rows="3" className="form-control" placeholder="Enter About your description" value={user.aboutInfo} readOnly="readOnly"></textarea>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="card-footer">
            <Link to="/EditProfile">
              <button type="submit" className="btn btn-primary">
                Edit Profile
              </button>
            </Link>
            {user?.role === "seller" && <Link to={`/user/${user?._id}`}>
              <button type="submit" className="btn btn-primary mx-2">
                Seller Page
              </button>
            </Link>}
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile