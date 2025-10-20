import { useNavigate } from 'react-router-dom';
import '../index.css'
import { useSelector } from 'react-redux';

function GameSelect() {
  const navigate = useNavigate();
  const user = useSelector(state => state.user.user)

  const handleClick = () => {
    navigate('/tracker/2')
  }

  return (
    <div>
      <h1>Username: {user.username}</h1>
      <h1>Role: {user.role}</h1>
      <p>Access Token: {user.accessToken}</p>
      <p></p>
      <button className='p-3' onClick={handleClick}> Go to Tracker </button>
    </div>
  )
}

export default GameSelect