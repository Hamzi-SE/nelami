import React from 'react'
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./PackagesPricing.css"
import { toast } from 'react-toastify';
import Loader from '../../Components/Loader/Loader';



const PackagesPricing = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, loading } = useSelector(state => state.user);
    const { packages } = useSelector(state => state?.data?.data);

    const dataLoading = useSelector(state => state?.data?.loading);

    const handlePackageClick = (pkgName, pkgPrice, pkgdesc, pkgId) => {

        dispatch({ type: "PLAN_PURCHASE", payload: { packageName: pkgName, packagePrice: pkgPrice, packageDescription: pkgdesc, packageId: pkgId } })

        navigate("/checkout")

    }

    if (!loading && user && (user?.role === "buyer")) {
        navigate("/")
        toast.warning(`${user?.role} can't access this page`)
        return;
    }

    if (loading || dataLoading) {
        return <Loader />
    }



    return (
        <>
            <div className="text-center my-5 py-5">
                <div className="container">
                    <div className="row pt-4">
                        <div className={`col-md-4`}>
                            <div className={`card mb-4 box-shadow ${user?.userPackage === "Free" ? "user-package-active" : ""}`}>
                                <div className="card-header">
                                    <h4 className="my-0 font-weight-normal"><b>{packages[0]?.name}</b></h4>
                                </div>
                                <div className="card-body">
                                    <h1><b>Rs. {packages[0]?.price} </b></h1>
                                    <ul className="list-unstyled mt-3 mb-4">
                                        {packages[0]?.description.split(",").map((item, index) => {
                                            return <li key={index}>{item}</li>
                                        })}
                                    </ul>
                                    {user?.userPackage === "Free" ? <h3>Current Plan</h3> : <Link to="/signup"> <button type="button" className="btn btn-lg btn-block btn-outline-primary">Sign up for free</button></Link>}
                                </div>
                            </div>
                        </div>
                        <div className={`col-md-4`}>
                            <div className={`card mb-4 box-shadow ${user?.userPackage === "Gold" ? "user-package-active" : ""}`}>
                                <div className="card-header">
                                    <h4 className="my-0 font-weight-normal"><b>{packages[1]?.name}</b></h4>
                                </div>
                                <div className="card-body">
                                    <h1><b>Rs. {packages[1]?.price} </b></h1>
                                    <ul className="list-unstyled mt-3 mb-4">
                                        {packages[1]?.description.split(",").map((item, index) => {
                                            return <li key={index}>{item}</li>
                                        })}
                                    </ul>
                                    {user?.userPackage === "Gold" ? <h3>Current Plan</h3> : <button type="button" className="btn btn-lg btn-block btn-primary" onClick={() => handlePackageClick(`${packages[1]?.name}`, `${packages[1]?.price}`, `${packages[1]?.description}`, 2)}>Purchase</button>}
                                </div>
                            </div>
                        </div>
                        <div className={`col-md-4 `}>
                            <div className={`card mb-4 box-shadow ${user?.userPackage === "Platinum" ? "user-package-active" : ""}`}>
                                <div className="card-header">
                                    <h4 className="my-0 font-weight-normal"><b>{packages[2]?.name}</b></h4>
                                </div>
                                <div className="card-body">
                                    <h1><b>Rs. {packages[2]?.price} </b></h1>
                                    <ul className="list-unstyled mt-3 mb-4">
                                        {packages[2]?.description.split(",").map((item, index) => {
                                            return <li key={index}>{item}</li>
                                        })}
                                    </ul>
                                    {user?.userPackage === "Platinum" ? <h3>Current Plan</h3> : <button type="button" className="btn btn-lg btn-block btn-primary" onClick={() => handlePackageClick(`${packages[2]?.name}`, `${packages[2]?.price}`, `${packages[2]?.description}`, 3)}>Purchase</button>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}

export default PackagesPricing