import { useNavigate } from "react-router-dom"
import '../index.css'

function Login() {
  const navigate = useNavigate()

  const goToTracker = () => {
    navigate('/tracker/2')
  }

  return (
    <>
      <p>Login Page</p>
      <button onClick={goToTracker()}> Go to Tracker </button>
    </>
  )
}

export default Login