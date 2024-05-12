import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../Loader/Loader";


const Topbar = () => {
  const { user, isAuthenticated, loading } = useSelector(state => state.user);

  if (loading) {
    return <Loader />
  }

  return (
    <>
      {/* <!--Topbar--> */}

      <div className="top-bar">
        <div className="container">
          <div className="row">
            <div className="col-xl-8 col-lg-8 col-sm-4 col-7">
              <div className="top-bar-left d-flex">
                <div className="clearfix">
                  <ul className="socials">
                    <li>
                      <a className="social-icon text-dark" href="https://www.facebook.com">
                        <i className="fa-brands fa-facebook-f"></i>
                      </a>
                    </li>
                    <li>
                      <a className="social-icon text-dark" href="https://www.twitter.com">
                        <i className="fa-brands fa-twitter"></i>
                      </a>
                    </li>
                    <li>
                      <a className="social-icon text-dark" href="https://www.linkedin.com">
                        <i className="fa-brands fa-linkedin-in"></i>
                      </a>
                    </li>
                    <li>
                      <a className="social-icon text-dark" href="https://myaccount.google.com">
                        <i className="fa-brands fa-google-plus-g"></i>
                      </a>
                    </li>
                  </ul>
                </div>

              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-sm-8 col-5">
              <div className="top-bar-right">
                <ul className="custom">
                  {isAuthenticated || (
                    <li>
                      <NavLink to="/Signup" className="text-dark">
                        <i className="fa fa-user me-1"></i>
                        <span>Register</span>
                      </NavLink>
                    </li>
                  )}
                  {isAuthenticated || (
                    <li>
                      <NavLink to="/Login" className="text-dark">
                        <i className="fa fa-sign-in me-1"></i>
                        <span>Login</span>
                      </NavLink>
                    </li>
                  )}
                  {isAuthenticated && user?.role !== "admin" && (
                    <li className="dropdown">
                      <NavLink to="/Dashboard" className="text-dark show">
                        <i className="fa fa-home me-1"></i>
                        <span>Dashboard</span>
                      </NavLink>
                    </li>
                  )}
                  {isAuthenticated && (
                    <li className="dropdown">
                      <NavLink to="/Messenger" className="text-dark show">
                        <i className='fab me-1'>&#xf39f;</i>
                        <span>Messenger</span>
                      </NavLink>
                    </li>
                  )}
                  {
                    user?.role === "admin" && (
                      <li className="dropdown">
                        <NavLink to="/admin/Dashboard" className="text-dark show">
                          <i className="fa fa-home me-1"></i>
                          <span>Dashboard</span>
                        </NavLink>
                      </li>
                    )
                  }
                  {isAuthenticated && (
                    <li>
                      <NavLink to="/Logout" className="text-dark">
                        <i className="fa fa-sign-in me-1"></i>
                        <span>Logout</span>
                      </NavLink>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Topbar;
