import { useNavigate } from 'react-router-dom';
import '../index.css'

function Home() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/login')
  }

  return (
    <div>
      <h1>Hello</h1>
      <button className='p-3' onClick={handleClick()}> Go to Tracker </button>
    </div>
  )
}

export default Home