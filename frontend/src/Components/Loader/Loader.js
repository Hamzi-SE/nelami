import React from 'react'
import { ThreeDots } from 'react-loader-spinner'
import "./Loader.css"

const Loader = () => {
    return (
        <>
            <div className="container-fluid loading-three-dots">
                <ThreeDots color="blue" height={80} width={80} />
            </div>
        </>
    )
}

export default Loader