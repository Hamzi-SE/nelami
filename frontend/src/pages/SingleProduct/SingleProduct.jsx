import React, { useEffect, useState } from 'react'
import moment from 'moment'
import Countdown from 'react-countdown'
import './SingleProduct.css'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

//Slider
import { Slide } from 'react-slideshow-image'
import 'react-slideshow-image/dist/styles.css'

//Icons
import { BsFillPinMapFill } from 'react-icons/bs'
import { IoBedOutline } from 'react-icons/io5'
import MetaData from '../../utils/MetaData'
import Loader from '../../Components/Loader/Loader'
import customFetch from '../../utils/api'

const MapComponent = ({ cityName }) => {
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(cityName)}&output=embed`

  return (
    <iframe
      title="map"
      width="100%"
      height="500"
      src={mapSrc}
      frameBorder="0"
      style={{ border: 0 }}
      allowFullScreen=""
      aria-hidden="false"
      tabIndex="0"
    ></iframe>
  )
}

const SingleProduct = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.user)
  const { loading, product, error } = useSelector((state) => state.singleProduct)
  const conversationLoading = useSelector((state) => state.conversation.loading)
  const { id } = useParams()
  const [seller, setSeller] = useState({})
  const [bidAmount, setBidAmount] = useState('')
  const [bidders, setBidders] = useState([])
  const [auctionTimeRemaining, setAuctionTimeRemaining] = useState()
  const [productImages, setProductImages] = useState([])
  const [biddersLoading, setBiddersLoading] = useState(false)

  const getSingleProduct = async () => {
    dispatch({ type: 'SINGLE_PRODUCT_REQUEST' })

    try {
      const res = await customFetch(`/api/v1/products/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await res.json()

      if (data?.product) {
        dispatch({ type: 'SINGLE_PRODUCT_SUCCESS', payload: data.product })
        setSeller(data.product.user)

        // Clear previous images and push new images to the array
        setProductImages(
          [
            data.product.images.featuredImg?.url,
            data.product.images.imageOne?.url,
            data.product.images.imageTwo?.url,
            data.product.images.imageThree?.url,
          ].filter(Boolean)
        ) // Filter out any undefined or null values

        // Calculate & set the time remaining for the auction
        const endDate = new Date(data.product.endDate).getTime()
        const currentTime = new Date().getTime()
        setAuctionTimeRemaining(endDate - currentTime)
      } else {
        // Handle case when product is not found in the response
        dispatch({ type: 'SINGLE_PRODUCT_FAIL', payload: 'Product not found' })
      }
    } catch (error) {
      dispatch({
        type: 'SINGLE_PRODUCT_FAIL',
        payload: error.message || 'An error occurred',
      })
    }
  }

  const getBidders = async () => {
    setBiddersLoading(true)
    try {
      const res = await customFetch(`/api/v1/bid/product/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      try {
        const data = await res.json()
        setBidders(data.bids)
      } catch (error) {
        console.log(error)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setBiddersLoading(false)
    }
  }

  useEffect(() => {
    getBidders()
    getSingleProduct()
  }, [id])

  const handleBidSubmit = async (e) => {
    dispatch({ type: 'BID_REQUEST' })
    e.preventDefault()
    // setLoading(true);

    if (!bidAmount) {
      toast.error('Please Enter Your Bid Amount')
      dispatch({ type: 'BID_FAIL', payload: 'Please Enter Your Bid Amount' })
      // setLoading(false);
      return
    }

    if (bidAmount < product.price) {
      // setLoading(false);
      setBidAmount('')
      dispatch({
        type: 'BID_FAIL',
        payload: `Minimum Bid Amount Should Be Greater Than ${product.price}`,
      })
      return toast.error(`Minimum Bid Amount Should Be Greater Than ${product.price}`)
    }
    try {
      const res = await customFetch(`/api/v1/bid/product/new/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price: bidAmount,
        }),
      })

      const data = await res.json()
      if (res.status === 201) {
        dispatch({ type: 'BID_SUCCESS', payload: data.newPresentBid })
        toast.success('Bid Added Successfully')
        getBidders()
      } else {
        dispatch({ type: 'BID_FAIL', payload: data.message })
        toast.error(data.message)
      }
    } catch (error) {
      dispatch({ type: 'BID_FAIL', payload: error })
      toast.error(error)
    }
    // setLoading(false);
    setBidAmount('')
    document.getElementsByClassName('modal-backdrop')[0].remove()
    document.getElementById('bidModal').classList.remove('show')
  }

  const startConversation = async () => {
    dispatch({ type: 'CREATE_CONVERSATION_REQUEST' })
    const res = await customFetch(`/api/v1/conversations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        senderId: user?._id,
        receiverId: product?.user._id,
      }),
    })
    const data = await res.json()

    if (res.status === 200) {
      dispatch({
        type: 'CREATE_CONVERSATION_SUCCESS',
        payload: data.conversation,
      })
      document.getElementsByClassName('modal-backdrop')[0].remove()
      toast(data.message, { icon: '🤝' })
    } else if (res.status === 201) {
      dispatch({
        type: 'CREATE_CONVERSATION_SUCCESS',
        payload: data.savedConversation,
      })
      document.getElementsByClassName('modal-backdrop')[0].remove()
      toast.success(data.message)
    } else {
      dispatch({ type: 'CREATE_CONVERSATION_FAIL', payload: data.message })
      document.getElementsByClassName('modal-backdrop')[0].remove()
      window.location.reload()
    }
    navigate(`/messenger`, { replace: true })
  }

  const Completionist = () => <h1 className="auction-complete">Auction Ended!</h1>

  let highestBid = 0
  let highestBidder = null

  const getHighestBidder = () => {
    if (!bidders || bidders.length === 0) {
      return null
    }

    bidders.forEach((bidderGroup) => {
      bidderGroup.bidders.forEach((bid) => {
        if (bid?.price > highestBid) {
          highestBid = bid?.price
          highestBidder = bid?.user
        }
      })
    })

    return highestBidder
  }

  if (product?.bidStatus === 'Expired') {
    highestBidder = getHighestBidder()
  }

  if (loading || conversationLoading) {
    return <Loader />
  }

  return (
    <>
      <MetaData
        title={!product ? 'Product Not Found' : product?.title + ' - Nelami'}
        description={product?.description}
      />
      {/* <!-- Modal --> */}
      <div
        className="modal fade"
        id={`chatModalSeller`}
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
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
            <div className="modal-body">Do you want to start a chat with {product?.user?.name} ?</div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">
                Cancel
              </button>
              <button type="button" className="btn btn-primary" onClick={startConversation}>
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* IMAGE POPUP MODAL SLIDER */}
      <div
        className="modal fade"
        id="imageSliderModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            {/* <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLongTitle">Modal title</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div> */}
            <div className="modal-body">
              <Slide autoplay={false} transitionDuration={500}>
                {productImages.map((slideImage, index) => (
                  <div className="each-slide" key={index}>
                    <img src={slideImage} alt="slideImage" />
                  </div>
                ))}
              </Slide>
            </div>
            {/* <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary">Save changes</button>
            </div> */}
          </div>
        </div>
      </div>
      {/* IMAGE POPUP MODAL SLIDER END*/}

      {product && bidders ? (
        <div className="main-external my-4 py-4">
          <div className="container">
            <div className="row single-product-page-wrapper">
              {/* <!-- Left Area --> */}

              <div className="col-lg-8 col-md-12 col-sm-12 left-side-content">
                <div className="row">
                  <div className="col-lg-8">
                    <div className="main-img">
                      <img
                        src={product?.images?.featuredImg?.url}
                        alt="featuredImg"
                        data-toggle="modal"
                        data-target="#imageSliderModal"
                      />
                    </div>
                  </div>

                  {product?.images && (
                    <div className="col-lg-4">
                      <div className="row no-gutters single-product-side-images">
                        {product?.images?.imageOne && (
                          <div className="col-lg-12 col-sm-3 side-img side-img-1">
                            <div className="small-img">
                              <img
                                src={product?.images?.imageOne?.url}
                                alt="imageOne"
                                data-toggle="modal"
                                data-target="#imageSliderModal"
                              />
                            </div>
                          </div>
                        )}
                        {product?.images?.imageTwo && (
                          <div className="col-lg-12 col-sm-3 side-img side-img-2">
                            <div className="small-img">
                              <img
                                src={product?.images?.imageTwo?.url}
                                alt="imageTwo"
                                data-toggle="modal"
                                data-target="#imageSliderModal"
                              />
                            </div>
                          </div>
                        )}
                        {product?.images?.imageThree && (
                          <div className="col-lg-12 col-sm-3 side-img side-img-3">
                            <div className="small-img">
                              <img
                                src={product?.images?.imageThree?.url}
                                alt="imageThree"
                                data-toggle="modal"
                                data-target="#imageSliderModal"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="description-main mt-5  py-3 mb-5">
                    <div className="single-product-seller-info">
                      <div className="d-flex justify-content-between">
                        <h4>
                          <b>Bid Posted By: </b>
                          {seller?.name}
                        </h4>
                        <header className="description-header seller-badges d-flex justify-content-between">
                          {product?.user?.userPackage === 'Free' && (
                            <button type="button" className="btn btn-info">
                              <b>Free</b> <i className="fa-solid fa-check"></i>
                            </button>
                          )}
                          {product?.user?.userPackage === 'Gold' && (
                            <button type="button" className="btn btn-warning">
                              <b>Gold</b> <i className="fa-regular fa-star"></i>
                            </button>
                          )}
                          {product?.user?.userPackage === 'Platinum' && (
                            <button type="button" className="btn btn-primary">
                              <b>Platinum</b> <i className="fa-solid fa-gem"></i>
                            </button>
                          )}
                        </header>
                      </div>
                      <h4>
                        <b>Posted on: </b>
                        {moment(product.createdAt).format('DD-MMM-yyyy')}
                      </h4>
                    </div>
                    <hr />
                    <div className="block-title description-title">
                      <h4>Description</h4>
                    </div>
                    <div>
                      <p className="product-description">{product.description}</p>
                    </div>
                    <hr />
                    <div className="block-title">
                      <h4>Price</h4>
                      <p className="product-price">Rs.{product.price.toLocaleString()}</p>
                    </div>
                    <hr />
                    {product?.features && product?.features.length !== 0 && (
                      <div className="block-title py-3 mb-5">
                        <h4>Features</h4>
                        <div className="single-product-features d-flex justify-content-start text-justify">
                          {product?.features?.map((feature, index) => (
                            <div className="lead" key={index}>
                              {feature}
                            </div>
                          ))}
                        </div>
                        <br />
                      </div>
                    )}

                    <div className="block-title py-3 mb-5">
                      <h4>More Information</h4>
                      <div className="single-product-more-info d-flex justify-content-start text-justify">
                        {product?.furnished && (
                          <div className="info-group">
                            {product?.furnished === 'furnished' ? (
                              <>
                                <i className="fa-solid fa-circle-check"></i> <div className="lead">Furnished</div>
                              </>
                            ) : (
                              <>
                                <i className="fa-solid fa-circle-xmark"></i> <div className="lead">Unfurnished</div>
                              </>
                            )}
                          </div>
                        )}

                        {product?.bedrooms && (
                          <div className="info-group">
                            <IoBedOutline />
                            <div className="lead">{product?.bedrooms} bedrooms</div>
                          </div>
                        )}

                        {product?.bathrooms && (
                          <div className="info-group">
                            <i className="fa-solid fa-sink"></i>
                            <div className="lead">{product?.bathrooms} Bathrooms</div>
                          </div>
                        )}

                        {product?.noOfStoreys && (
                          <div className="info-group">
                            <i className="fa-solid fa-arrow-turn-up"></i>
                            <div className="lead">{product?.noOfStoreys} Storeys</div>
                          </div>
                        )}

                        {product?.constructionState && (
                          <div className="info-group">
                            <i className="fa-solid fa-circle-info"></i>
                            <div className="lead">{product?.constructionState}</div>
                          </div>
                        )}

                        {product?.type && (
                          <div className="info-group">
                            <i className="fa-solid fa-circle-info"></i>
                            <div className="lead">Type: {product?.type}</div>
                          </div>
                        )}

                        {product?.make && (
                          <div className="info-group">
                            <i className="fa-solid fa-circle-info"></i>
                            <div className="lead">Make: {product?.make}</div>
                          </div>
                        )}

                        {product?.model && (
                          <div className="info-group">
                            <i className="fa-solid fa-circle-info"></i>
                            <div className="lead">Model: {product?.model}</div>
                          </div>
                        )}

                        {product?.year && (
                          <div className="info-group">
                            <i className="fa-solid fa-circle-info"></i>
                            <div className="lead">Year: {product?.year}</div>
                          </div>
                        )}

                        {product?.kmsDriven && (
                          <div className="info-group">
                            <i className="fa-solid fa-circle-info"></i>
                            <div className="lead">Driven: {product?.kmsDriven}Km</div>
                          </div>
                        )}

                        {product?.fuelType && (
                          <div className="info-group">
                            <i className="fa-solid fa-circle-info"></i>
                            <div className="lead">Fuel Type: {product?.fuelType}</div>
                          </div>
                        )}

                        {product?.floorLevel && (
                          <div className="info-group">
                            <i className="fa-regular fa-building"></i>
                            <div className="lead">{product?.floorLevel} Floor Level</div>
                          </div>
                        )}

                        {product?.area && (
                          <div className="info-group">
                            <BsFillPinMapFill />
                            <div className="lead">
                              {product.area} {product.areaUnit} Area
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <hr />

                    <div className="mb-3">
                      <div className="block-title mt-5 py-3">
                        <h4>Location</h4>
                        {product.location && (
                          <p>
                            {product.location.province} - {product.location.city}
                          </p>
                        )}
                      </div>
                      <div className="store-location">
                        {product.location && (
                          <MapComponent cityName={product.location?.province + ' ' + product.location?.city} />
                        )}
                      </div>
                    </div>
                    <hr />
                    <div className="block-title mt-5 py-3">
                      <h4>Seller</h4>
                    </div>
                    <div className="user-detail d-flex mt-1">
                      <div className="user-img">
                        <img
                          src={seller?.avatar ? seller?.avatar.url : 'https://i.postimg.cc/mD9SJc41/149071.png'}
                          alt="seller"
                        />
                      </div>
                      <div className="name-detail">
                        <div className="lead">
                          <h4 className="m-0">
                            <b>{seller?.name}</b>
                          </h4>
                          Phone No: <b>{seller.phoneNo}</b>
                        </div>
                        <div className="mt-2">
                          {seller.aboutInfo || '----------No about information of this seller----------'}
                        </div>
                      </div>
                      <div className="d-flex justify-content-center align-items-center flex-column">
                        <button type="button" className="btn btn-primary w-100">
                          <b data-toggle="modal" data-target={`#chatModalSeller`}>
                            Message
                          </b>
                        </button>
                        <button
                          type="button"
                          className="btn btn-light mt-2 w-100"
                          onClick={() => navigate(`/user/${seller._id}`)}
                        >
                          <b>View Profile</b>
                        </button>
                      </div>
                    </div>
                    <hr />
                  </div>

                  {/* <!-- Card --> */}
                  {/* <h2>More Products</h2> */}
                  {/* <div className="Cards-main">
                    <div className="card mx-5" style={{ width: "20rem" }}>
                      <ProductCard />
                    </div>
                    <div className="card mx-5" style={{ width: "20rem" }}>
                      <ProductCard />
                    </div>
                  </div> */}
                </div>
              </div>

              {/* <!-- Left Area Ends  --> */}

              {/* <!-- Right Area --> */}

              <div className="col-lg-4 col-md-12 col-sm-12">
                <h2 className="text-center mb-5 pb-5">
                  <b>{product.title}</b>
                </h2>
                <div className="auction-timer position-relative">
                  {auctionTimeRemaining && product?.bidStatus === 'Live' && (
                    <Countdown date={Date.now() + auctionTimeRemaining}>
                      <Completionist />
                    </Countdown>
                  )}
                </div>
                <h3 className={`text-center m-3 ${product?.bidStatus === 'Live' ? 'text-success' : 'text-danger'} `}>
                  <b>Bid Status: {product.bidStatus}</b>
                </h3>

                {/* <!-- Button trigger modal --> */}
                {auctionTimeRemaining < 0 || (product?.bidStatus === 'Expired' && bidders?.length > 0) ? (
                  highestBidder &&
                  highestBid && (
                    <h3 className="text-warning text-center">
                      <i className="fa fa-crown"></i> {highestBidder?.name} won the bid with a price of Rs.{' '}
                      {highestBid.toLocaleString()}
                    </h3>
                  )
                ) : product?.bidStatus === 'Expired' && bidders?.length === 0 ? (
                  <h3 className="text-warning text-center">This bidding has been expired with no bidders</h3>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary btn-lg btn-block mt-3 btn-bidnow"
                    data-toggle="modal"
                    data-target="#bidModal"
                  >
                    Bid Now
                  </button>
                )}

                {/* <!-- Modal --> */}
                {product?.bidStatus !== 'Expired' && (
                  <div
                    className="modal fade"
                    id="bidModal"
                    tabIndex="-1"
                    role="dialog"
                    aria-labelledby="bidModalLabel"
                    aria-hidden="true"
                  >
                    <div className="modal-dialog" role="document">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h3 className="modal-title" id="bidModalLabel">
                            Place Bid
                          </h3>
                          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <form method="POST" onSubmit={handleBidSubmit}>
                          <div className="modal-body">
                            <h4>Enter Your Bid Amount</h4>
                            <div className="d-flex">
                              <h3 className="m-0 d-flex align-items-end justify-content-center">Rs. </h3>
                              <input
                                type="number"
                                value={bidAmount}
                                onChange={(e) => setBidAmount(e.target.value)}
                                className="form-control input-bid"
                                placeholder="Enter Your Bid Amount"
                              />
                            </div>
                          </div>
                          <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">
                              Close
                            </button>
                            <button type="submit" className="btn btn-primary">
                              Place Your Bid Now
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                )}

                <div className="container mt-3 bg-white px-2 py-3">
                  <div>
                    <h5>
                      <b>Bidders</b>
                    </h5>
                  </div>
                  {biddersLoading && <p>Loading...</p>}
                  {!biddersLoading && (
                    <ul className="unorder-list mt-4">
                      <li>
                        {bidders.length !== 0 ? (
                          bidders.map((bidder, index) => {
                            return (
                              <div key={index}>
                                {bidder.bidders
                                  .sort((a, b) => b.price - a.price)
                                  .map((user, index) => {
                                    return (
                                      <div
                                        key={index}
                                        className="bidder-data d-flex my-3"
                                        style={{
                                          border:
                                            index === 0
                                              ? '2px solid #FFD700'
                                              : index === 1
                                                ? '2px solid #C0C0C0'
                                                : index === 2
                                                  ? '2px solid #cd7f32'
                                                  : '',
                                        }}
                                      >
                                        <div className="userindex">
                                          <span>{index + 1}</span>{' '}
                                        </div>
                                        <div className="userimg">
                                          <img className="bidder-dp" src={user?.user?.avatar?.url} alt="user" />
                                        </div>
                                        <span className="username"> {user?.user?.name} </span>
                                        <div className="price">
                                          <b>Rs. {user.price.toLocaleString()}</b>
                                        </div>
                                      </div>
                                    )
                                  })}
                              </div>
                            )
                          })
                        ) : (
                          <h4 className="text-center">
                            No bidders {product?.bidStatus !== 'Expired' ? 'yet' : ''} on this product
                          </h4>
                        )}
                      </li>
                    </ul>
                  )}
                </div>
              </div>

              {/* <!-- Right Area Ends --> */}
            </div>
          </div>
        </div>
      ) : (
        <div className="product-not-found-container d-flex flex-column my-3 h-100 w-100 justify-content-center align-items-center">
          <img src="/page_not_found.svg" alt="Product Not Found" style={{ maxWidth: '100%', height: 'auto' }} />
          {/* error */}
          {error && (
            <h2 className="my-5">
              Reason: <strong>{error}</strong>
            </h2>
          )}
          <Link to="/" className="btn btn-primary my-3">
            Go to Home Page
          </Link>
        </div>
      )}
    </>
  )
}

export default SingleProduct
