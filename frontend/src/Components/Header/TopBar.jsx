import React, { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import './TopBar.css'
import customFetch from '../../utils/api'
import { ClipLoader } from 'react-spinners'
import { useSocket } from '../../hooks/useSocket'
import toast from 'react-hot-toast'

const TopBar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { user, isAuthenticated } = useSelector((state) => state.user)
  const { notifications, loading, error } = useSelector((state) => state.notifications)

  const location = useLocation()
  const dispatch = useDispatch()
  const socket = useSocket()

  useEffect(() => {
    // Fetch notifications once per page load
    const fetchNotifications = async () => {
      dispatch({ type: 'GET_NOTIFICATIONS_REQUEST' })
      try {
        const response = await customFetch('/api/v1/notification/all', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const data = await response.json()
        dispatch({
          type: 'GET_NOTIFICATIONS_SUCCESS',
          payload: data.notifications,
        })
      } catch (err) {
        dispatch({ type: 'GET_NOTIFICATIONS_FAIL', payload: err.message })
      }
    }

    if (isAuthenticated) {
      fetchNotifications()
    }
  }, [dispatch, isAuthenticated])

  useEffect(() => {
    setIsDropdownOpen(false)
  }, [location])

  useEffect(() => {
    // Setup WebSocket listener for notifications
    const handleNotification = (notification) => {
      dispatch({ type: 'ADD_NOTIFICATION', payload: notification })
      playNotificationSound()
    }

    if (isAuthenticated && socket) {
      socket.on('getNotification', handleNotification)
    }

    // Cleanup function to remove the WebSocket listener
    return () => {
      if (isAuthenticated && socket) {
        socket.off('getNotification', handleNotification)
      }
    }
  }, [dispatch, isAuthenticated, socket])

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const playNotificationSound = () => {
    const audio = new Audio('/notification-sound.mp3')
    audio.play().catch((error) => {
      console.error('Error playing audio:', error)
    })
  }

  const handleMarkAsRead = async (notificationId) => {
    try {
      const response = await customFetch('/api/v1/notification/mark-as-read', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notificationId }),
      })
      const data = await response.json()
      if (response.ok) {
        dispatch({
          type: 'MARK_NOTIFICATION_AS_READ',
          payload: data.notification._id,
        })
      } else {
        toast.error(data?.message || 'Failed to mark as read. Please try again.')
        dispatch({
          type: 'MARK_NOTIFICATION_AS_READ_FAIL',
          payload: data.message,
        })
      }
    } catch (error) {
      dispatch({
        type: 'MARK_NOTIFICATION_AS_READ_FAIL',
        payload: error.message,
      })
    }
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
                      <a className="social-icon text-dark" href="https://www.facebook.com">
                        <i className="fa-brands fa-facebook-f"></i>
                      </a>
                    </li>
                    <li>
                      <a className="social-icon text-dark" href="https://www.twitter.com">
                        <i className="fa-brands fa-twitter"></i>
                      </a>
                    </li>
                    <li>
                      <a className="social-icon text-dark" href="https://www.linkedin.com">
                        <i className="fa-brands fa-linkedin-in"></i>
                      </a>
                    </li>
                    <li>
                      <a className="social-icon text-dark" href="https://myaccount.google.com">
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
                        <button className="dropdown-toggle text-dark" onClick={handleDropdownToggle}>
                          <i className="fa fa-bell me-1"></i>
                          <span>Notifications</span>
                          {notifications?.filter((notification) => !notification.read).length > 0 && (
                            <p className="badge bg-danger text-white notifications-count">
                              {notifications?.filter((notification) => !notification.read).length}
                            </p>
                          )}
                        </button>
                        {isDropdownOpen && (
                          <ul className={`dropdown-menu ${isDropdownOpen ? 'show' : ''}`}>
                            {loading ? (
                              <li className="d-flex justify-content-center align-items-center">
                                <ClipLoader size={24} color="blue" />
                              </li>
                            ) : error ? (
                              <li>Error: {error}</li>
                            ) : notifications?.length === 0 ? (
                              <li className="d-flex justify-content-center align-items-center">No notifications</li>
                            ) : (
                              notifications?.map((notification, index) => (
                                <li
                                  key={index}
                                  style={{
                                    fontWeight: !notification.read ? 'bold' : '',
                                  }}
                                >
                                  {notification.link ? (
                                    <NavLink
                                      to={notification.link}
                                      style={{
                                        fontWeight: !notification.read ? 'bold' : '',
                                      }}
                                    >
                                      <i className="fa fa-external-link me-1"></i> {notification.message}
                                    </NavLink>
                                  ) : (
                                    <div>
                                      <i className="fa-solid fa-envelope-open me-1"></i>
                                      {notification.message}
                                    </div>
                                  )}
                                  {/* mark as read button */}
                                  {!notification.read && (
                                    <button
                                      title="Mark as read"
                                      className="btn btn-sm btn-primary"
                                      onClick={() => handleMarkAsRead(notification._id)}
                                    >
                                      <i className="fa fa-check text-white"></i>{' '}
                                    </button>
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
