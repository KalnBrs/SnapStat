import { useState } from "react";
import { setPenalty } from "../../Features/game/gameSlice";
import Button from "./Button";
import { useDispatch } from "react-redux";

function Penalty({setFunc}) {
  const [autoFirst, setAutoFirst] = useState(false)

  const dispatch = useDispatch()
  return (
    <>
      <div className="mt-3">
        <Button label={'Auto First Down'} onClick={() => setAutoFirst(true)} isActive={autoFirst} width={150} margin={0} />
        <div className='justify-center my-3'>
          <Button label={'Submit Penalty'} show={true} onClick={() => {console.log('submit'); dispatch(setPenalty(false)); setFunc(''); }} />
        </div>
      </div>
    </>
  )
}

export default Penalty