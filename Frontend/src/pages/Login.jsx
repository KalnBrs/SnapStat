import { useNavigate } from "react-router-dom"
import '../index.css'
import { useState } from "react"
import { logIn } from "../Scripts/login"
import store from "../Store/store"
import { setUser } from "../Features/user/userSlice"
import { useSelector } from "react-redux"

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [passwordType, setPasswordType] = useState("password");
  const [imagePath, setImagePath] = useState('eyeOn.png')

  const [showInccorect, setShowInccorect] = useState(false)

  const user = useSelector(state => state.user.user)

  const navigate = useNavigate()

  const toggleShow = () => {
    setPasswordType(prevType => (prevType === "password" ? "text" : "password"));
    setImagePath(prevType => (prevType === 'eyeOn.png' ? "eyeOff.png" : 'eyeOn.png'))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const result = await logIn(username, password)
    if (result == null) {
      setShowInccorect(true)
      return;
    }

    console.log(result)

    setShowInccorect(false)
    store.dispatch(setUser({
      ...user,
      accessToken: result.accessToken,
      username: result.user.username,
      role: result.user.role
    }))

    navigate('/tracker/')
  }

  return (
    <>
      <form className="bg-gray-200 rounded-md p-3 w-150" onSubmit={handleSubmit}>
        <p className="text-gray-500 text-md text-left ml-2">Please enter your details</p>
        <p className="relative text-black font-bold text-4xl ml-2 -top-1 text-left pb-2.5">Welcome Back</p>
        <div className="bg-gray-300 shadow-md border-1 border-black rounded-md flex my-2 relative input-group">
          <input 
            type="username"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required 
            className="w-full text-black pl-2 outline-none input-field" />
          <label htmlFor="username" className="text-black bg-transparent text-lg -top-0.5 justify-left pl-5 absolute ease-in-out duration-300 pointer-events-none input-label">Username </label>
        </div>
        <div className="bg-gray-300 shadow-md border-1 border-black rounded-md flex my-2 relative input-group">
          <input 
            type={passwordType}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full text-black pl-2 outline-none  input-field" />
          <button className="showButton" onClick={toggleShow}><img src={imagePath} alt="" /></button>
          <label htmlFor="password" className="text-black bg-transparent text-lg -top-0.5 justify-left pl-5 absolute ease-in-out duration-300 pointer-events-none input-label">Password </label>
        </div>
        {showInccorect && <p>Inccorect Password or Username not found</p>}
        <button type="submit" className="px-40"> Log In </button>
      </form>

      
    </>
  )
}

export default Login