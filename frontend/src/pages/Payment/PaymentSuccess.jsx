import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useLocation, useNavigate } from 'react-router-dom'
import customFetch from '../../utils/api'
import Confetti from 'react-confetti'
import { callProfile } from '../../helpers/CallProfile'
import { useDispatch } from 'react-redux'

const SuccessPage = () => {
  const [session, setSession] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchSession = async () => {
      const query = new URLSearchParams(location.search)
      const sessionId = query.get('session_id')

      if (sessionId) {
        try {
          const res = await customFetch(`/api/v1/payment/stripe/session?session_id=${sessionId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          })

          const data = await res.json()

          if (res.status === 200) {
            setSession(data.session)
            dispatch({ type: 'PLAN_PAYMENT_SUCCESS' })
            callProfile(dispatch)
            toast.success('Plan upgraded successfully')
          } else {
            toast.error(`Error fetching session details: ${data.message}`)
            console.error('Error fetching session details:', data.message)
            navigate('/', { replace: true })
          }
        } catch (error) {
          toast.error('Error fetching session details')
          console.error('Error fetching session details:', error)
          navigate('/', { replace: true })
        }
      }
    }

    fetchSession()
  }, [location.search, navigate])

  if (!session) {
    return (
      <div className="container text-center my-5 py-5">
        <h2>Loading...</h2>
      </div>
    )
  }

  return (
    <div className="container my-5 py-5">
      {session.status === 'complete' && <Confetti recycle={false} numberOfPieces={1000} />}
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8 text-center">
          <div className="alert alert-success my-5 py-5">
            <h1 className="alert-heading">Payment Successful!</h1>
            <p className="lead">Thank you for your purchase. Your payment was processed successfully.</p>
            <hr />
            <p>
              <strong>Session ID:</strong> {session.id}
            </p>
            <p>
              <strong>Amount:</strong> {session.amount_total / 100} {session.currency.toUpperCase()}
            </p>
            <p>
              <strong>Status:</strong> {session.payment_status}
            </p>
            {/* Add more details as needed */}
            <button className="btn btn-primary mt-4" onClick={() => navigate('/')}>
              Go to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SuccessPage
