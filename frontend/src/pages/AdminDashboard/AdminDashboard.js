import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { toastOptions } from "../../App";
import { BsBoxArrowLeft } from "react-icons/bs"

//CSS
import "./AdminDashboard.css"

//Componets
import StatsDashboard from "./StatsDashboard/StatsDashboard";
import Profile from "./Profile/Profile";
import AllUsers from "./AllUsers/AllUsers";
import AllProducts from "./AllProducts/AllProducts";
import ApprovalProducts from "./ApprovalProducts/ApprovalProducts.js";
import Settings from "./Settings/Settings";
import MetaData from "../../utils/MetaData";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../../Components/Loader/Loader";
import EditFeatures from "./EditFeatures/EditFeatures";


const AdminDashboard = () => {
    const dispatch = useDispatch();
    const { activeComponent } = useSelector((state) => state.dashboard);
    const { user, loading, isAuthenticated } = useSelector(state => state.user);
    const navigate = useNavigate();


    const handleActiveComponent = (e) => {
        dispatch({ type: "SET_ACTIVE_COMPONENT", payload: e.currentTarget.dataset.component })

        //Toggle active class from all the buttons
        const componentsButtons = document.querySelectorAll(".side-menu__item")
        componentsButtons.forEach((item) => {
            item.addEventListener("click", function () {
                componentsButtons.forEach((item) => {
                    item.classList.remove("active-component");
                    this.classList.add("active-component");
                })
            });
        });
    };




    if (loading) {
        return <Loader />
    }

    if (!isAuthenticated) {
        navigate("/login")
    }
    if (isAuthenticated && user?.role !== "admin") {
        navigate("/")
        toast.error("Only admin can access this page", toastOptions);

    }




    return (
        <>
            <MetaData title="Admin Dashboard" />
            {/* <!--Breadcrumb--> */}
            <section>
                <div className="bannerimg cover-image bg-background3" data-bs-image-src="https://res.cloudinary.com/dwnvcgdsy/image/upload/v1661528469/biddingwebsiteavatars/banner2_jp08xz.webp">
                    <div className="header-text mb-0">
                        <div className="container">
                            <div className="text-center text-white ">
                                <h1 className="">Admin Dashboard</h1>
                                <ol className="breadcrumb text-center">
                                    <li className="breadcrumb-item">
                                        <Link to="/">Home</Link>
                                    </li>
                                    <li className="breadcrumb-item active text-white" aria-current="page">
                                        Admin Dashboard
                                    </li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* <!--Breadcrumb--> */}


            {/* <!--User Dashboard--> */}
            <section className="sptb admin-dashboard">
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
                                            {user?.avatar && <img src={user?.avatar?.url} className="brround" alt="admin" />}
                                        </div>
                                        <h3 className="mt-3 mb-0 font-weight-semibold">{user?.name}</h3>
                                        <h3 className="mt-3 mb-0 font-weight-semibold text-success" style={{ textTransform: "capitalize" }}>
                                            {user?.role}
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

                                            <li data-component={"allUsers"} onClick={handleActiveComponent} className="slide">
                                                <button className="side-menu__item" data-bs-toggle="slide">
                                                    <i className="fa-solid fa-users"></i>
                                                    <span className="side-menu__label">All Users</span>
                                                    <i className="angle fa fa-angle-right"></i>
                                                </button>
                                            </li>

                                            <li data-component={"allProducts"} onClick={handleActiveComponent} className="slide">
                                                <button className="side-menu__item" data-bs-toggle="slide">
                                                    <i className="fa-solid fa-box-open"></i>
                                                    <span className="side-menu__label">All Products</span>
                                                    <i className="angle fa fa-angle-right"></i>
                                                </button>
                                            </li>

                                            <li data-component={"approvalProducts"} onClick={handleActiveComponent} className="slide">
                                                <button className="side-menu__item" data-bs-toggle="slide">
                                                    <i className="fa-solid fa-square-check"></i>
                                                    <span className="side-menu__label">Approval Products</span>
                                                    <i className="angle fa fa-angle-right"></i>
                                                </button>
                                            </li>

                                            <li data-component={"editFeatures"} onClick={handleActiveComponent} className="slide">
                                                <button className="side-menu__item" data-bs-toggle="slide">
                                                    <i className="fa-regular fa-pen-to-square"></i>
                                                    <span className="side-menu__label">Edit Features</span>
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
                        {activeComponent === "allUsers" && <AllUsers />}
                        {activeComponent === "allProducts" && <AllProducts />}
                        {activeComponent === "approvalProducts" && <ApprovalProducts />}
                        {activeComponent === "editFeatures" && <EditFeatures />}
                        {activeComponent === "settings" && <Settings />}
                        {/*{activeComponent === "myBids" && <MyBids />}
                        {activeComponent === "safetyTips" && <SafetyTips />}
                        */}
                    </div>
                </div>
            </section>
            {/* <!--/admin Dashboard--> */}
        </>
    )
}

export default AdminDashboard