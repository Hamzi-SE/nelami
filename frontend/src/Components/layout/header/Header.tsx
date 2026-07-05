import MobileNav from './MobileNav'
import Navbar from './Navbar'
import TopBar from './TopBar'

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
