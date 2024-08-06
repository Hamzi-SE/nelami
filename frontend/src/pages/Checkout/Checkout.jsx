import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Loader from '../../Components/Loader/Loader'

import MetaData from '../../utils/MetaData'
import customFetch from '../../utils/api'
import './checkout.css'

const Checkout = () => {
  const navigate = useNavigate()
  const orderPackage = useSelector((state) => state.package.package)
  const orderPrice = useSelector((state) => state.package.price)
  const orderId = useSelector((state) => state.package.packageId)
  const orderDescription = useSelector((state) => state.package.description)

  const [checkoutFormLoading, setCheckoutFormLoading] = useState(true)
  const { loading } = useSelector((state) => state.payment)
  const userLoading = useSelector((state) => state.user.loading)
  const dispatch = useDispatch()
  const payBtn = useRef(null)

  const { isAuthenticated } = useSelector((state) => state.user)

  const paymentData = {
    id: orderId,
  }

  const submitHandler = async (e) => {
    e.preventDefault()

    payBtn.current.disabled = true
    dispatch({ type: 'PLAN_PAYMENT_REQUEST' })
    try {
      const res = await customFetch('/api/v1/payment/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentData,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        dispatch({ type: 'PLAN_PAYMENT_FAIL', payload: data.message })
        toast.error(data.message)
        return
      }

      // Redirect user to the Stripe checkout session URL
      if (data && data.sessionUrl) {
        window.location.href = data.sessionUrl
      }
    } catch (error) {
      dispatch({
        type: 'PLAN_PAYMENT_FAIL',
        payload: error?.message || "There's an issue while processing the payment",
      })
      payBtn.current.disabled = false
      toast.error(error.message || 'Payment processing error')
    }
  }

  useEffect(() => {
    if (userLoading) {
      return <Loader />
    }
    if (!userLoading && !isAuthenticated) {
      toast.error('Please log in to upgrade your plan')
      navigate('/packages')
      return
    }
    if (!orderPackage || !orderPrice) {
      navigate('/packages')
      toast.error('Please select a package')
      return
    }
    setCheckoutFormLoading(false)
  }, [userLoading, isAuthenticated, orderPackage, orderPrice, navigate])

  return (
    <>
      <MetaData title="Checkout" />

      {checkoutFormLoading ? (
        <Loader />
      ) : (
        <div className="container my-5 py-5">
          <div className="text-center mb-4">
            <img
              className="d-block mx-auto mb-4"
              src="https://i.postimg.cc/q7LJxFWx/3c03db78-b11b-46a7-a3e0-e45762a7b991.jpg"
              alt="Logo"
              width="240"
              height="120"
            />
            <h2 className="mb-3">Checkout</h2>
            <p className="lead mb-4">You will be redirected to a secure payment page to complete your transaction.</p>
            <hr />
          </div>

          <div className="row">
            <div className="col-md-12">
              <h4 className="mb-3">Plan Details</h4>
              <ul className="list-group mb-3">
                <li className="list-group-item d-flex justify-content-between lh-condensed">
                  <div>
                    <h5 className="my-0 font-weight-bold">Plan</h5>
                    <p className="text-muted">{orderPackage}</p>
                    <h6 className="mt-3 font-weight-bold">Description</h6>
                    <ul className="list-unstyled">
                      {orderDescription.split('\n').map((item, index) => (
                        <li key={index}>- {item}</li>
                      ))}
                    </ul>
                  </div>
                  <span className="text-muted">Rs. {orderPrice}</span>
                </li>

                <li className="list-group-item d-flex justify-content-between">
                  <span className="font-weight-bold">Total (PKR)</span>
                  <strong>Rs. {orderPrice}</strong>
                </li>
              </ul>

              <div className="text-center">
                <form onSubmit={submitHandler}>
                  <button type="submit" className="btn btn-primary btn-lg" ref={payBtn} disabled={loading}>
                    {loading ? 'Processing...' : 'Proceed to Payment'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Checkout
