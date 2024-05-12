import React from "react";
import { Link } from "react-router-dom";

const BottomFooter = () => {
  return (
    <>
      {/* <!--Footer Section--> */}
      <section className="footer">
        <footer className="bg-dark text-white">

          <div className="bg-dark text-white p-0">
            <div className="container">
              <div className="row d-flex">
                <div className="col-lg-12 col-sm-12  mt-2 mb-2 text-center ">
                  Copyright © 2024 Nelami. All rights reserved.
                </div>

              </div>
            </div>
          </div>
          <div className="bg-dark text-white p-0 border-top">
            <div className="container">
              <div className="p-2 text-center footer-links">
                <Link to="/">Home</Link>
                <Link to="/products">Products</Link>
                <Link to="/packages">Packages</Link>
                <Link to="/product/new">Post Free Ad</Link>
                <Link to="/login">Login</Link>
                <Link to="/Signup">Register</Link>
              </div>
            </div>
          </div>
        </footer>
      </section>
      {/* <!--/Footer Section--> */}
    </>
  );
};

export default BottomFooter;
