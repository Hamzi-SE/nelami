import TopBar from './TopBar'
import Navbar from './Navbar'
import MobileNav from './MobileNav'

const Header = () => {
  return (
    <header className="relative z-50">
      <TopBar />
      <div className="relative">
        <MobileNav />
        <Navbar />
      </div>
    </header>
  )
}

export default Header
