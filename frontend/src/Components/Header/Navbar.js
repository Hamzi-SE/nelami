import React from "react";
import { useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import Loader from "../Loader/Loader";


const Navbar = () => {
  const { user, isAuthenticated, loading } = useSelector(state => state.user);

  if (loading) {
    return <Loader />
  }

  return (
    <>
      {/* <!--Nav--> */}
      <div>
        <div className="horizontal-main clearfix">
          <div className="horizontal-mainwrapper container clearfix">
            <div className="desktoplogo">
              <NavLink to="/" className="light-logo">
                <img src="https://i.postimg.cc/q7LJxFWx/3c03db78-b11b-46a7-a3e0-e45762a7b991.jpg" alt="logo" className="w-10" style={{ transform: "scale(1.5)" }} />
              </NavLink>
              <NavLink to="/" className="dark-logo">
                <h3>Multi Vendor</h3>
              </NavLink>
            </div>
            {/* Navbar */}

            <nav className="horizontalMenu clearfix d-md-flex">
              <ul role="menubar" className="horizontalMenu-list">
                <li role="menuitem" aria-haspopup="true">
                  <NavLink to="/" className="">
                    Home
                  </NavLink>
                </li>
                <li role="menuitem" aria-haspopup="true">
                  <NavLink to="/Products">
                    Products
                  </NavLink>
                </li>

                <li role="menuitem" aria-haspopup="true">
                    <Link to="#" className="dropdown-toggle" type="button" id="menu1" data-toggle="dropdown">
                      Categories
                    </Link>
                    <ul className="dropdown-menu" role="menu" aria-labelledby="menu1">
                      <li role="menuitem"><Link to="/categories/Vehicles">Vehicles</Link></li>
                      <li role="menuitem"><Link to="/categories/Property">Properties</Link></li>
                      <li role="menuitem"><Link to="/categories/MiscProducts">Miscellaneous Products</Link></li>
                    </ul>
                </li>

                {(isAuthenticated ? user?.role === "seller" || user?.role === "admin" : true) && <li role="menuitem" aria-haspopup="true">
                  <NavLink to="/Packages">
                    Packages
                  </NavLink>
                </li>}

                <li role="menuitem" aria-haspopup="true">
                  <NavLink to="/Contact">
                    Contact
                  </NavLink>
                </li>



                {/*  */}

                <li role="menuitem" aria-haspopup="true" className="d-lg-none mt-5 pb-5 mt-lg-0">
                  <span>
                    <NavLink className="btn btn-secondary" to="/addnew">
                      Post Free Ad
                    </NavLink>
                  </span>
                </li>
              </ul>
              <ul className="mb-0">
                <li role="menuitem" aria-haspopup="true" className="mt-5">
                  <span>
                    <NavLink className="btn btn-secondary" to="/product/new">
                      Post Free Ad
                    </NavLink>
                  </span>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {/* <!--Nav--> */}
    </>
  );
};

export default Navbar;
