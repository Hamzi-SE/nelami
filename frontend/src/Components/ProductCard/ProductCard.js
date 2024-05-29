import Tippy from '@tippyjs/react';
import React, { useState } from "react";
import Countdown from 'react-countdown';
import { BsChatSquareText, BsClockHistory } from "react-icons/bs";
import { FaHeart } from "react-icons/fa";
import { FiHeart, FiUsers } from "react-icons/fi";
import { IoLocationOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import 'tippy.js/dist/tippy.css';
import customFetch from "../../utils/api";
import Loader from "../Loader/Loader";
import "./ProductCard.css";
import { callProfile } from '../../helpers/CallProfile';

const ProductCard = (props) => {

  const dispatch = useDispatch();

  let { product, index } = props;
  const { user } = useSelector(state => state.user);

  const conversationLoading = useSelector(state => state.conversation.loading);

  const navigate = useNavigate();

  // check if the product is already added to wishlist
  const [added, setAdded] = useState(user?.wishlist?.includes(product?._id) ? true : false);
  
  const [bidCount, setBidCount] = useState(0);

  let remainingTime = new Date(product?.endDate).getTime() - new Date().getTime();


  const Completionist = () => <span className="card-auction-complete">Auction Ended!</span>;

  const getBidsCount = async () => {
    const res = await customFetch(`/api/v1/bid/product/${product?._id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
    const data = await res.json();
    (data?.bids && data?.bids[0]?.bidders?.length) ? setBidCount(data?.bids[0]?.bidders?.length) : setBidCount(0);
    return;
  }


  const startConversation = async () => {
    dispatch({ type: "CREATE_CONVERSATION_REQUEST" })
    const res = await customFetch(`/api/v1/conversations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        senderId: user?._id,
        receiverId: product?.user._id,
      })
    })
    const data = await res.json();

    if (res.status === 201) {
      dispatch({ type: "CREATE_CONVERSATION_SUCCESS", payload: data.savedConversation })
      document.getElementsByClassName("modal-backdrop")[0].remove();
      toast.success(data.message)
    } else if (res.status === 200) {
      dispatch({ type: "CREATE_CONVERSATION_SUCCESS", payload: data.conversation })
      document.getElementsByClassName("modal-backdrop")[0].remove();
      toast.success(data.message)

    } else {
      dispatch({ type: "CREATE_CONVERSATION_FAIL", payload: data.message })
      document.getElementsByClassName("modal-backdrop")[0].remove();
      toast.error(data.message)
    }
    navigate(`/messenger`, { replace: true })



  }

  const addToWishlistHandler = async () => {

    const res = await customFetch(`/api/v1/addToWishlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        productId: product._id
      })
    })
    const data = await res.json();

    if (res.status === 200) {
      toast.warning(data.message)
      setAdded(false);
    }
    else if (res.status === 201) {
      toast.success(data.message)
      setAdded(true)
    }
    else {
      toast.error(data.message)
    }

    callProfile(dispatch)
    
  }


  getBidsCount();

  if (conversationLoading) {
    return <Loader />
  }

  // useEffect(() => {
  //   // if remaining time is less than 0 then set bid status to expired
  //   if (remainingTime <= 0) {
  //     product.bidStatus = "Expired";
  //   }
  // }, [remainingTime])


  return (
    <>

      {/* <!-- Modal --> */}
      <div className="modal fade" id={`chatModal-${index}`} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                <div className="user-wrapper">
                  <img src={product?.user?.avatar?.url} alt="avatar" className="avatar-small" />
                  <h3>{product?.user?.name}</h3>
                </div>
              </h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              Do you want to start a chat with {product?.user?.name} ?
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Cancel</button>
              <button type="button" className="btn btn-primary" onClick={startConversation}>Yes</button>
            </div>
          </div>
        </div>
      </div>


      {product && <div className=" col-md-12 col-sm-12 p-0 ">
        <div className="card overflow-hidden">
          <Link to={`/Product/${product._id}`}>
            <div className="item-card-img">
              <div className={`arrow-ribbon ${product.bidStatus === "Expired" ? "expired-label" : "bg-primary"}`}>{product.bidStatus}</div>
              <div className="item-card-imgs">
                <img src={product.images.featuredImg.url} alt="img" className="cover-image" />
              </div>
              {
                product.bidStatus === "Live" && (
                  <div className="item-card7-overlaytext">
                    <div className={remainingTime > 0 ? "text-white badge badge-warning timer-wrapper timer-live" : "text-white badge badge-warning timer-wrapper timer-ended"}>
                      <span className="bid-time">
                        <BsClockHistory />
                        {<Countdown date={Date.now() + remainingTime}>
                          <Completionist />
                        </Countdown>}
                        {/* {auctionTimeRemaining} */}
                      </span>
                    </div>
                  </div>
                )
              }
            </div>
            <div className="card-body">
              <div className="product-card">
                <p>{product.category}</p>
                <div className="text-dark mt-2">
                  <h4 className="font-weight-semibold product-title mt-1" title={product.title}>
                    {product.title.length > 40 ? (product.title).substring(0, 40) + "..." : product.title}
                  </h4>
                </div>
                <div className="product-card-desc d-flex justify-content-start align-items-center">
                  <IoLocationOutline /> {product.location.province}
                </div>
              </div>
            </div>
          </Link>
          <div className="card-footer">
            <div className="item-card-footer d-flex justify-content-between align-items-center">
              <div className="item-card-cost">
                <h4 className="text-dark font-weight-semibold mb-0 mt-0">
                  <div className="product-actions">
                    <Tippy content="Chat With Seller">
                      <button data-toggle="modal" data-target={`#chatModal-${index}`}><BsChatSquareText /></button>
                    </Tippy>
                    <Tippy content="Add To Wishlist">
                      <button onClick={addToWishlistHandler}>{added ? <FaHeart /> : <FiHeart />}</button>
                    </Tippy>
                    <Tippy content={`${bidCount <= 1 ? `${bidCount} bid` : `${bidCount} bids`}`}>
                      <button> <FiUsers /></button>
                    </Tippy>


                  </div>
                </h4>
              </div>
              <div className="price-sec footer-right">
                <h6 className="product-price price">
                  <strong>Rs. {product.price.toLocaleString()}</strong>
                </h6>
              </div>
            </div>
          </div>
        </div>
      </div>
      }
    </>

  );
};

export default ProductCard;
