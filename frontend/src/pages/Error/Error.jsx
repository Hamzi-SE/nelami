import React from "react";
import { NavLink } from "react-router-dom";
import MetaData from "../../utils/MetaData";

const Error = () => {
  return (
    <>
      <MetaData title="Error - Nelami" />
      <div id="notfound" className="d-flex justify-content-center align-items-center m-5 p-5">
        <div className="notfound">
          <div className="notfound-404">
            <h1>404 (×_×)</h1>
          </div>
          <h2>We are sorry, page not found!</h2>
          <p className="mb-5">The page you are looking for does not exists</p>
          <NavLink to="/">
            <i className="fa fa-arrow-left" aria-hidden="true"></i> Back to Homepage
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default Error;
