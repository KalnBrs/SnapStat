import { useEffect } from 'react';
import './Error.css'
import { useSelector, useDispatch } from 'react-redux';
import { setError } from '../../Features/error/errorSlice';

function Error() {
  const show = useSelector(state => state.error.show)
  const message = useSelector(state => state.error.message)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(() => {
      dispatch(setError({show: false, message: ''}))
    }, 5000)

    return () => clearTimeout(timer);
  }, [show, dispatch])

  if (!show) return;

  return (
    <div className='bg-red-400/80 mb-10 p-2'>
      <p className='font-bold'>There was an error</p>
      <p>{message ? message : ''}</p>
    </div>
  )
}

export default Error