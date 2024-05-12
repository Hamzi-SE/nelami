import React from "react";
import { AiOutlineSafety } from "react-icons/ai";
import { BsBoxArrowLeft } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Profile from "./Profile/Profile";

import "./Dashboard.css";

//Components
import Loader from "../../Components/Loader/Loader";
import MetaData from "../../utils/MetaData";
import MyBids from "./MyBids/MyBids";
import MyProducts from "./MyProducts/MyProducts";
import WaitingApproval from "./MyProducts/WaitingApproval";
import MyWishlist from "./MyWishlist/MyWishlist";
import SafetyTips from "./SafetyTips/SafetyTips";
import Settings from "./Settings/Settings";
import StatsDashboard from "./StatsDashboard/StatsDashboard";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { loading, user, isAuthenticated } = useSelector((state) => state.user);
  const { activeComponent } = useSelector((state) => state.dashboard);


  const handleActiveComponent = (e) => {



    //Toggle active className from all the buttons
    const componentsButtons = document.querySelectorAll(".side-menu__item")
    componentsButtons.forEach((item) => {
      item.addEventListener("click", function () {
        componentsButtons.forEach((item) => {
          item.classList.remove("active-component");
          this.classList.add("active-component");
        })
      });
    });

    dispatch({ type: "SET_ACTIVE_COMPONENT", payload: e.currentTarget.dataset.component })

  };


  if (loading) {
    return <Loader />
  } else if (!isAuthenticated) {
    return (
      <h1 className="text-danger text-center my-5 py-5">Please Login To Access Dashboard</h1>
    )
  }



  return (
    <>
      <MetaData title="Dashboard - Nelami" />
      {/* <!--Breadcrumb--> */}
      <section>
        <div className="bannerimg cover-image bg-background3" data-bs-image-src="https://res.cloudinary.com/dwnvcgdsy/image/upload/v1661528469/biddingwebsiteavatars/banner2_jp08xz.webp">
          <div className="header-text mb-0">
            <div className="container">
              <div className="text-center text-white ">
                <h1 className="">My Dashboard</h1>
                <ol className="breadcrumb text-center">
                  <li className="breadcrumb-item">
                    <Link to="/">Home</Link>
                  </li>
                  <li className="breadcrumb-item active text-white" aria-current="page">
                    My Dashboard
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!--Breadcrumb--> */}


      {/* <!--User Dashboard--> */}
      <section className="sptb user-dashboard">
        <div className="container">
          <div className="row">
            <div className="col-xl-3 col-lg-12 col-md-12">
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">My Dashboard</h3>
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
                <aside className="app-sidebar doc-sidebar my-dash">
                  <div className="app-sidebar__user clearfix">
                    <ul className="side-menu">
                      <li data-component={"statsDashboard"} onClick={handleActiveComponent} className="slide">
                        <button className="side-menu__item active-component" data-bs-toggle="slide">
                          <i className="fa-solid fa-chart-line"></i>
                          <span className="side-menu__label">Stats Overview</span>
                          <i className="angle fa fa-angle-right"></i>
                        </button>
                      </li>
                      <li data-component={"profile"} onClick={handleActiveComponent} className="slide">
                        <button className="side-menu__item" data-bs-toggle="slide">
                          <i className="fa-solid fa-user"></i>
                          <span className="side-menu__label">Profile</span>
                          <i className="angle fa fa-angle-right"></i>
                        </button>
                      </li>
                      {/* eslint-disable-next-line */}
                      {user.role == "seller" && <li data-component={"myAds"} onClick={handleActiveComponent} className="slide">
                        <button className="side-menu__item" data-bs-toggle="slide">
                          <i className="fa-solid fa-money-bill-1"></i>
                          <span className="side-menu__label">My Ads</span>
                          <i className="angle fa fa-angle-right"></i>
                        </button>
                      </li>
                      }
                      {/* eslint-disable-next-line */}
                      {user.role == "seller" && <li data-component={"waitingApproval"} onClick={handleActiveComponent} className="slide">
                        <button className="side-menu__item" data-bs-toggle="slide">
                          <i className="fa-solid fa-arrows-rotate"></i>
                          <span className="side-menu__label">Waiting Approval</span>
                          <i className="angle fa fa-angle-right"></i>
                        </button>
                      </li>
                      }
                      {/* eslint-disable-next-line */}
                      {user.role == "buyer" && <li data-component={"myBids"} onClick={handleActiveComponent} className="slide">
                        <button className="side-menu__item" data-bs-toggle="slide">
                          <i className="fa-solid fa-gavel"></i>
                          <span className="side-menu__label">My Bids</span>
                          <i className="angle fa fa-angle-right"></i>
                        </button>
                      </li>
                      }
                      {/* eslint-disable-next-line */}
                      {user.role == "buyer" && <li data-component={"myWishlist"} onClick={handleActiveComponent} className="slide">
                        <button className="side-menu__item" data-bs-toggle="slide">
                          <i className="fa-regular fa-heart"></i>
                          <span className="side-menu__label">My Wishlist</span>
                          <i className="angle fa fa-angle-right"></i>
                        </button>
                      </li>
                      }
                      <li data-component={"safetyTips"} onClick={handleActiveComponent} className="slide">
                        <button className="side-menu__item" data-bs-toggle="slide">
                          {/* <FontAwesomeIcon icon="fa-solid fa-octagon-exclamation" /> */}
                          <AiOutlineSafety />
                          <span className="side-menu__label">Safety Tips</span>
                          <i className="angle fa fa-angle-right"></i>
                        </button>
                      </li>

                      <li data-component={"settings"} onClick={handleActiveComponent} className="slide">

                        <button className="side-menu__item" data-bs-toggle="slide">
                          <i className="fa-solid fa-gear"></i>
                          <span className="side-menu__label">Settings</span>
                          <i className="angle fa fa-angle-right"></i>
                        </button>
                      </li>


                      <li>
                        <Link className="side-menu__item" to="/Logout">
                          <BsBoxArrowLeft />
                          <span className="side-menu__label">Logout</span>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </aside>
              </div>


            </div>
            {activeComponent === "statsDashboard" && <StatsDashboard />}
            {activeComponent === "profile" && <Profile user={user} />}
            {activeComponent === "myAds" && <MyProducts />}
            {activeComponent === "waitingApproval" && <WaitingApproval />}
            {activeComponent === "myBids" && <MyBids />}
            {activeComponent === "myWishlist" && <MyWishlist />}
            {activeComponent === "safetyTips" && <SafetyTips />}
            {activeComponent === "settings" && <Settings />}
          </div>
        </div>
      </section>
      {/* <!--/User Dashboard--> */}

    </>
  );
};

export default Dashboard;
