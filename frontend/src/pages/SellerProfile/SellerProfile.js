import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../../Components/Loader/Loader';
import ProductCard from '../../Components/ProductCard/ProductCard';
import "./SellerProfile.css";
import customFetch from '../../utils/api';

const SellerProfile = () => {
    const dispatch = useDispatch();
    const { seller, products, loading } = useSelector(state => state.sellerProfile);
    const { id } = useParams();
    const navigate = useNavigate();
    const callSellerProfile = async () => {
        dispatch({ type: "LOAD_SELLER_REQUEST" });
        try {
            const res = await customFetch(`/api/v1/seller/${id}`, {
                method: "GET",
                "Content-Type": "application/json",
            });

            const data = await res.json();
            if (res.status === 200) {
                if (data.user.role === "seller") {
                    
                    dispatch({ type: "LOAD_SELLER_SUCCESS", payload: { seller: data.user, products: data.products } });
                } else {
                    dispatch({ type: "LOAD_SELLER_FAIL", payload: `${data.user.role} does not have a shop page` });
                    toast.error(`${data.user.role} does not have a shop page`);
                    navigate("/products")
                }

            } else {
                dispatch({ type: "LOAD_SELLER_FAIL", payload: data.message });
                toast.error(data.message);
                navigate("/");
            }
        } catch (error) {
            dispatch({ type: "LOAD_SELLER_FAIL", payload: error });
            toast.error(error);
            console.log(error);
        }
    }

    useEffect(() => {
        callSellerProfile();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    if (loading) {
        return <Loader />
    }

    return (
        <>
            <div className="header-2 single-Seller-Page">
                <div className="banner-1 cover-image sptb-2 bg-background" data-bs-image-src="../assets/images/banners/banner1.jpg">
                    <div className="header-text1 mb-0">
                        <div className="container">
                            <div className="row">
                                <div className="col-xl-8 col-lg-12 col-md-12 d-block mx-auto">
                                    <div className="text-center">
                                        <h1 className="text-white text-uppercase">Seller Profile</h1>
                                        <div className="card-body text-center item-user">
                                            <div className="profile-pic">
                                                <div className="profile-pic-img">
                                                    {seller?.avatar && <img src={seller?.avatar?.url} className="brround" alt="user" />}
                                                </div>
                                                <h3 className="mt-3 mb-0 font-weight-semibold">{seller?.name}</h3>
                                                <p>{seller?.aboutInfo}</p>
                                                <h5>{seller?.userPackage} User</h5>
                                                <h3 className="mt-3 mb-0 font-weight-semibold" style={{ textTransform: "capitalize" }}>
                                                    {seller?.store}
                                                </h3>
                                            </div>
                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* <!-- /header-text --> */}
                </div>
                <div className="col-10 mx-auto">

                    <h1 className='text-center mt-5'>{seller?.name}'s Products</h1>

                    <div className="card mb-0">
                        <div className="card-body">
                            <div className="item2-gl">
                                <div className="tab-content">
                                    <div className="row products-page-products-wrapper">
                                        {
                                            products?.length !== 0 ? products?.map((product, index) => {

                                                return <div key={index} className='product-wrapper col-xl-3 col-lg-4 col-md-6 col-sm-12'>
                                                    <ProductCard product={product} index={index} />

                                                </div>
                                            }) : <h3 className="text-center">No Products Found</h3>}

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SellerProfile