import { useSelector, useDispatch } from "react-redux"
import { useState } from "react"
import { Menu, X, LogOut } from "lucide-react"
// import { logout } from "../../Features/user/userSlice" // adjust path if needed
import "../../index.css"
import { setUser } from "../../Features/user/userSlice"
import { logOut } from "../../Scripts/login"

function NavBar() {
  const user = useSelector(state => state.user.user)
  const dispatch = useDispatch()
  const [menuOpen, setMenuOpen] = useState(false)
  const [logedOut, setLogedOut] = useState(false)


  const handleLogout = async () => {
    await logOut()
    dispatch(setUser(null))
    setLogedOut(true)
  }

  const links = user?.username
    ? [
        { name: "Teams", href: "/teams" },
        { name: "Game Select", href: "/tracker" },
      ]
    : [
        { name: "Login", href: "/login" },
        { name: "Sign Up", href: "/signup" },
      ]

  return (
    <nav className="w-full bg-[#0f0f0f] text-gray-200 shadow-md fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-14">
        {/* Logo */}
        <a href="/" className="flex items-center space-x-2">
          <span className="text-lg font-semibold tracking-wide">Snap Stat</span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6 items-center">
          {links.map(link => (
            <a
              key={link.name}
              href={link.href}
              className="hover:text-green-400 transition-colors duration-200"
            >
              {link.name}
            </a>
          ))}

          {user?.username  && (
            <div className="flex items-center gap-4">
              <span className="px-3 py-1 bg-green-700 rounded-md text-white font-medium">
                {user.username}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md transition-all duration-200"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-gray-300 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#111] border-t border-gray-800">
          {links.map(link => (
            <a
              key={link.name}
              href={link.href}
              className="block px-6 py-3 hover:bg-[#1a1a1a] transition-colors duration-200"
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}

          {user?.username && (
            <>
              <div className="px-6 py-3 border-t border-gray-800 text-green-400">
                Logged in as <strong>{user?.username}</strong>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-6 py-3 flex items-center gap-2 text-red-400 hover:bg-[#1a1a1a] transition"
              >
                <LogOut size={16} /> Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  )
}

export default NavBar
