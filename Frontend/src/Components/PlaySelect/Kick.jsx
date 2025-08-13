import DropDown from "./DropDown"
import Button from "./Button"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setReturn, setPenalty } from "../../Features/game/gameSlice"
const kickOptions = [
  {
    label: "Extra Point",
    value: "extra_point"
  },
  {
    label: "Punt",
    value: "punt"
  },
  {
    label: "Field Goal",
    value: "field_goal"
  },
  {
    label: "Kick Off",
    value: "kickoff"
  }
]

function Kick({setFunc}) {
  const [kickType, setKickType] = useState()
  const [made, setMade] = useState(false)
  const [blocked, setBlocked] = useState(false)

  const [autoFirst, setAutoFirst] = useState(false)

  const dispatch = useDispatch()
  const penCondition = useSelector(state => state.game.penalty)

  function setDefault(option) {
    dispatch(setReturn(option.value == 'punt' || option.value == 'kickoff'))
    setMade(false)
    setBlocked(false)
  }

  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-row my-5">
          <p className='self-center font-bold mx-3'>Kick Type: </p>
          <DropDown options={kickOptions.map(option => option)} selectedValue={kickType} setSelect={(option) => {setKickType(option); setDefault(option)}} />
          {(kickType?.value == "extra_point" || kickType?.value == "field_goal") &&
            <div className="flex items-center justify-center mx-3">
              <Button
              label={"Made"}
              onClick={() => {setMade(!made); setBlocked(false); dispatch(setReturn(false))}}
              isActive={made}
              width={200}
              />
              <Button
              label={"Blocked"}
              onClick={() => {setMade(false); setBlocked(!blocked); dispatch(setReturn(!blocked ? true : false))}}
              isActive={blocked}
              width={200}
              />
            </div>}
            {kickType?.value == 'punt' && 
            <div className="flex items-center justify-center mx-3">
              <Button
              label={"Blocked"}
              onClick={() => {setMade(false); setBlocked(!blocked); dispatch(setReturn(!blocked ? true : false))}}
              isActive={blocked}
              width={200}
              />
            </div>
            }
            <div className="flex items-center justify-center mx-3">
              <Button label={'Penalty'} onClick={() => {dispatch(setPenalty(!penCondition)); setAutoFirst(false)}} isActive={penCondition} width={100} margin={0} />
              {penCondition && <Button label={'Auto First Down'} onClick={() => setAutoFirst(true)} isActive={autoFirst} width={150} margin={0} />}
            </div>
        </div>
      </div>
      <div className='justify-center'>
        <Button label={'Submit'} show={true} onClick={() => {console.log('submit'); setFunc('')}} />
      </div>
    </>
  )
}

export default Kick