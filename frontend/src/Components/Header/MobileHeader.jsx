import React, { useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'

const MobileHeader = () => {
  const location = useLocation()
  const isAppleDevice = useRef(/Mac|iPod|iPhone|iPad/.test(navigator.platform))
  const horizontalNavtoggleRef = useRef(null)
  const bodyRef = useRef(document.body)

  useEffect(() => {
    const toggleActiveClass = () => {
      if (bodyRef.current.classList.contains('active')) {
        bodyRef.current.classList.remove('active')
      }
    }

    const handleClick = () => {
      bodyRef.current.classList.toggle('active')
    }

    const horizontalNavtoggle = horizontalNavtoggleRef.current

    if (isAppleDevice.current) {
      if (horizontalNavtoggle) {
        horizontalNavtoggle.addEventListener('click', handleClick)
      }
    }

    // Listen for route changes
    toggleActiveClass()

    // Cleanup event listeners on component unmount
    return () => {
      if (horizontalNavtoggle) {
        horizontalNavtoggle.removeEventListener('click', handleClick)
      }
    }
  }, [location])

  return (
    <>
      {/* <!-- Mobile Header --> */}
      <div className="sticky">
        <div className="horizontal-header clearfix ">
          <div className="container">
            <button
              style={{ border: '0px' }}
              id="horizontal-navtoggle"
              className="animated-arrow"
              ref={horizontalNavtoggleRef}
            >
              <span></span>
            </button>
            <span className="smllogo">
              <Link to="/">
                <img src="https://i.postimg.cc/q7LJxFWx/3c03db78-b11b-46a7-a3e0-e45762a7b991.jpg" alt="logo" />
              </Link>
            </span>
            <a href="tel:+92-315-6088777" className="callusbtn">
              <i className="fa fa-phone" aria-hidden="true"></i>
            </a>
          </div>
        </div>
      </div>
      {/* <!-- Mobile Header --> */}
    </>
  )
}

export default MobileHeader
