import { useSelector } from "react-redux"
import "../../index.css"

function NavBar() {
  const user = useSelector(state => state.user.user)

  return (
    <div className="flex w-screen bg-black h-10 items-center justify-center">
      <a href="/">Home</a>

      {user.username != null ? <a href="">{user.username}</a> : <a href="/login">Log In</a>}
    </div>
  )
}

export default NavBar