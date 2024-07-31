import TopBar from './TopBar.jsx'
import Navbar from './Navbar'
import MobileHeader from './MobileHeader'

import React from 'react'

const Header = () => {
  return (
    <>
      <div className="header-main">
        <TopBar />
        <MobileHeader />
        <Navbar />
      </div>
    </>
  )
}

export default Header
