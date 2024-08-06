import React from 'react'
import { useNavigate } from 'react-router-dom'

const PaymentFail = () => {
  const navigate = useNavigate()

  return (
    <div className="container my-5 py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="alert alert-danger text-center py-5">
            <h2 className="alert-heading mb-4">Payment Failed</h2>
            <p className="lead mb-4">
              Unfortunately, your payment could not be processed. Please try again or contact support if the issue
              persists.
            </p>
            <hr />
            <p className="mb-4">
              If you need help, please{' '}
              <a href="mailto:nelami@ihamza.dev" className="alert-link">
                contact our support team
              </a>
              .
            </p>
            <button className="btn btn-primary mt-4" onClick={() => navigate('/')}>
              Go to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentFail
