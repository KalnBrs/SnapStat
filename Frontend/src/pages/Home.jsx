import { useNavigate } from 'react-router-dom';
import '../index.css'

function Home() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/login')
  }

  return (
    <div className='flex flex-col justify-self-center'>
      <h1>Home Page</h1>
      <button className='p-3' onClick={handleClick}> Go to Log in </button>
    </div>
  )
}

export default Home