import { useEffect } from 'react';
import './Error.css'

function Error({show, message, setErrObj}) {
  if (!show) {
    return null; 
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setErrObj({show: false, message: ''})
    }, 5000)

    return () => clearTimeout(timer);
  }, [])

  return (
    <div className='bg-red-400/80 mb-10 p-2'>
      <p className='font-bold'>There was an error</p>
      <p>{message ? message : ''}</p>
    </div>
  )
}

export default Error