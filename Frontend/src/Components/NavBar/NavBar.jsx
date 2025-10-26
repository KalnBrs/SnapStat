import { useSelector } from "react-redux"
import "../../index.css"

function NavBar() {
  const user = useSelector(state => state.user.user)

  return (
    <div className="flex w-screen bg-black h-10 items-center linkContainer">
      <div className="ml-10">
        <a href="/">Home</a>
      </div>
      <img src="" alt="" />
      <div className="ml-auto mr-10 ">
        {user.username != null ? <div> 
          <a className="mx-4" href="/teams">Teams</a>
          <a className="mx-4" href="/tracker">Game Select</a>
          <a className="mx-4" href="">{user.username}</a>
        </div> : <a href="/login">Log In</a>}
      </div>
    </div>
  )
}

export default NavBar