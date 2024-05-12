import React from "react";
import { Link } from "react-router-dom";

const MobileHeader = () => {
  return (
    <>
      {/* <!-- Mobile Header --> */}
      <div className="sticky">
        <div className="horizontal-header clearfix ">
          <div className="container">
            <button style={{ border: "0px" }} id="horizontal-navtoggle" className="animated-arrow">
              <span></span>
            </button>
            <span className="smllogo">
              <Link to="/">
                <img src="https://i.postimg.cc/q7LJxFWx/3c03db78-b11b-46a7-a3e0-e45762a7b991.jpg" alt="logo" />
              </Link>
            </span>
            <a href="tel:+92-315-6088777" className="callusbtn">
              <i className="fa fa-phone" aria-hidden="true"></i>
            </a>
          </div>
        </div>
      </div>
      {/* <!-- Mobile Header --> */}
    </>
  );
};

export default MobileHeader;
