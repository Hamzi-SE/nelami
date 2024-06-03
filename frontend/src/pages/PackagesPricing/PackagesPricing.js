import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import Loader from '../../Components/Loader/Loader';
import "./PackagesPricing.css";

const PackagesPricing = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, loading } = useSelector(state => state.user);
    const data = useSelector(state => state?.data?.data);

    // Check if data is null or undefined and assign a default empty object to avoid errors
    const { packages } = data || { packages: [] };

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
                        {packages.map((pkg, index) => (
                            <div key={index} className={`col-md-4 card mb-4 box-shadow ${user?.userPackage === pkg.name ? "user-package-active" : ""}`}>
                                <div className="card-header">
                                    <h4 className="my-0 font-weight-normal"><b>{pkg.name}</b></h4>
                                </div>
                                <div className="card-body">
                                    <h1><b>Rs. {pkg.price}</b></h1>
                                    <ul className="list-unstyled mt-3 mb-4">
                                        {pkg.description.split(",").map((item, idx) => <li key={idx}>{item}</li>)}
                                    </ul>
                                    {user?.userPackage === pkg.name ? (
                                        <h3>Current Plan</h3>
                                    ) : (
                                        <button type="button" className="btn btn-lg btn-block btn-primary" onClick={() => index === 0 ? navigate("/SignUp") : handlePackageClick(pkg.name, pkg.price, pkg.description, index + 1)}>
                                            {index === 0 ? "Get Started for Free" : "Purchase"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default PackagesPricing;
