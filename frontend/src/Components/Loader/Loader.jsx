import React from 'react'
import { ClipLoader } from 'react-spinners'
import './Loader.css'

const Loader = () => {
  return (
    <>
      <div className="container-fluid loading-three-dots">
        <ClipLoader color="blue" size={80} aria-label="Loading Spinner" />
      </div>
    </>
  )
}

export default Loader
