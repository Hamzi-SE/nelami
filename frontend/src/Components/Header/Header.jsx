import Topbar from "./Topbar";
import Navbar from "./Navbar";
import MobileHeader from "./MobileHeader";

import React from "react";

const Header = () => {
  return (
    <>
      <div className="header-main">
        <Topbar />
        <MobileHeader />
        <Navbar />
      </div>
    </>
  );
};

export default Header;
