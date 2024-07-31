import React, { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import './TopBar.css'
import customFetch from '../../utils/api'
import { ClipLoader } from 'react-spinners'

const TopBar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [loadingNotifications, setLoadingNotifications] = useState(false)
  const [error, setError] = useState(null)

  const location = useLocation()
  const { user, isAuthenticated } = useSelector((state) => state.user)

  useEffect(() => {
    if (isDropdownOpen) {
      const fetchNotifications = async () => {
        setLoadingNotifications(true)
        setError(null)
        try {
          const response = await customFetch('/api/v1/notification/all', {
            method: 'GET',
            'Content-Type': 'application/json',
          })
          if (!response.ok) {
            throw new Error('Failed to fetch notifications')
          }
          const data = await response.json()
          setNotifications(data.notifications)
        } catch (err) {
          setError(err.message)
        } finally {
          setLoadingNotifications(false)
        }
      }

      fetchNotifications()
    }
  }, [isDropdownOpen])

  useEffect(() => {
    setIsDropdownOpen(false)
  }, [location])

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  return (
    <>
      {/* <!--Topbar--> */}
      <div className="top-bar">
        <div className="container">
          <div className="row">
            <div className="col-xl-6 col-lg-6 col-sm-4 col-7">
              <div className="top-bar-left d-flex">
                <div className="clearfix">
                  <ul className="socials">
                    <li>
                      <a
                        className="social-icon text-dark"
                        href="https://www.facebook.com"
                      >
                        <i className="fa-brands fa-facebook-f"></i>
                      </a>
                    </li>
                    <li>
                      <a
                        className="social-icon text-dark"
                        href="https://www.twitter.com"
                      >
                        <i className="fa-brands fa-twitter"></i>
                      </a>
                    </li>
                    <li>
                      <a
                        className="social-icon text-dark"
                        href="https://www.linkedin.com"
                      >
                        <i className="fa-brands fa-linkedin-in"></i>
                      </a>
                    </li>
                    <li>
                      <a
                        className="social-icon text-dark"
                        href="https://myaccount.google.com"
                      >
                        <i className="fa-brands fa-google-plus-g"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-sm-8 col-5">
              <div className="top-bar-right">
                <ul className="custom">
                  {isAuthenticated || (
                    <li>
                      <NavLink to="/Signup" className="text-dark">
                        <i className="fa fa-user me-1"></i>
                        <span>Register</span>
                      </NavLink>
                    </li>
                  )}
                  {isAuthenticated || (
                    <li>
                      <NavLink to="/Login" className="text-dark">
                        <i className="fa fa-sign-in me-1"></i>
                        <span>Login</span>
                      </NavLink>
                    </li>
                  )}
                  {isAuthenticated && user?.role !== 'admin' && (
                    <li className="dropdown">
                      <div className="notification-dropdown">
                        <button
                          className="dropdown-toggle text-dark"
                          onClick={handleDropdownToggle}
                        >
                          <i className="fa fa-bell me-1"></i>
                          <span>Notifications</span>
                        </button>
                        {isDropdownOpen && (
                          <ul
                            className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}
                          >
                            {loadingNotifications ? (
                              <li className="d-flex justify-content-center align-items-center">
                                <ClipLoader size={24} color="blue" />
                              </li>
                            ) : error ? (
                              <li>Error: {error}</li>
                            ) : notifications.length === 0 ? (
                              <li className="d-flex justify-content-center align-items-center">
                                No notifications
                              </li>
                            ) : (
                              notifications.map((notification, index) => (
                                <li key={index}>
                                  {notification.link ? (
                                    <NavLink to={notification.link}>
                                      <i className="fa fa-external-link me-1"></i>{' '}
                                      {notification.message}
                                    </NavLink>
                                  ) : (
                                    <>
                                      <i class="fa-solid fa-envelope-open me-1"></i>
                                      {notification.message}
                                    </>
                                  )}
                                </li>
                              ))
                            )}
                          </ul>
                        )}
                      </div>
                    </li>
                  )}
                  {isAuthenticated && user?.role !== 'admin' && (
                    <li className="dropdown">
                      <NavLink to="/Dashboard" className="text-dark show">
                        <i className="fa fa-home me-1"></i>
                        <span>Dashboard</span>
                      </NavLink>
                    </li>
                  )}
                  {isAuthenticated && (
                    <li className="dropdown">
                      <NavLink to="/messenger" className="text-dark show">
                        <i className="fab me-1">&#xf39f;</i>
                        <span>Messenger</span>
                      </NavLink>
                    </li>
                  )}
                  {user?.role === 'admin' && (
                    <li className="dropdown">
                      <NavLink to="/admin/Dashboard" className="text-dark show">
                        <i className="fa fa-home me-1"></i>
                        <span>Admin Dashboard</span>
                      </NavLink>
                    </li>
                  )}
                  {isAuthenticated && (
                    <li>
                      <NavLink to="/Logout" className="text-dark">
                        <i className="fa fa-sign-in me-1"></i>
                        <span>Logout</span>
                      </NavLink>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default TopBar
