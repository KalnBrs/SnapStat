import './PlaySelect.css'

import DropDown from './DropDown'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import { setReturn, setPenalty } from '../../Features/game/gameSlice'
import Button from './Button'

function Rush({setFunc}) {
  const [rbSelect, setRB] = useState()
  const [tackler, setTackler] = useState()
  const [isFumble, setIsFumble] = useState(false)
  const [fumbleRecoverer, setFumbleRecoverer] = useState() 

  const [autoFirst, setAutoFirst] = useState(false)

  const homeRoster = useSelector(state => state.roster.home)
  const awayRoster = useSelector(state => state.roster.away)
  const offense = useSelector(state => state.game.offense)
  const retCondition = useSelector(state => state.game.return)
  const penCondition = useSelector(state => state.game.penalty)
  const dispatch = useDispatch()

  const options = offense === "home" ? homeRoster : awayRoster;
  const oppOption = offense === "home" ? awayRoster : homeRoster;

  return (
    <>
      <div className='flex flex-col'>
        <div className='flex flex-row my-5'>
          <p className='self-center font-bold mx-3'>RB: </p>
          <DropDown options={options.map(obj => ({
            ...obj,
            label: `#${obj.number} - ${obj.name}`,
            value: obj.player_id 
            }))} 
            selectedValue={rbSelect} 
            setSelect={(option) => setRB(option)} />
          <div className='flex items-center justify-center mx-3'>
            <Button label={"Fumble"} isActive={isFumble} onClick={() => {setIsFumble(!isFumble); dispatch(setReturn(!retCondition))}} width={200} />
            <Button label={'Penalty'} onClick={() => {dispatch(setPenalty(!penCondition)); setAutoFirst(false)}} isActive={penCondition} width={100} margin={0} />
            {penCondition && <Button show={penCondition} label={'Auto First Down'} onClick={() => setAutoFirst(true)} isActive={autoFirst} width={150} margin={0} />}
          </div>
        </div>
        <div className='flex flex-row my-5'>
        {!isFumble ? 
          <>
          <p className='self-center font-bold mx-3'>Tackler: </p>
          <DropDown options={oppOption.map(obj => ({
            ...obj,
            label: `#${obj.number} - ${obj.name}`,
            value: obj.player_id 
            }))} 
            selectedValue={tackler} 
            setSelect={(option) => setTackler(option)} />
          </> : 
          <>
            <p className='self-center font-bold mx-3'>Fumble Recoverer: </p>
            <DropDown options={oppOption.map(obj => ({
              ...obj,
              label: `#${obj.number} - ${obj.name}`,
              value: obj.player_id 
              }))} 
              selectedValue={fumbleRecoverer} 
              setSelect={(option) => setFumbleRecoverer(option)} />
          </> 
        }
        </div>
      </div>
      <div className='justify-center'>
        <Button label={'Submit'} show={true} onClick={() => {console.log('submit'); setFunc('')}} />
      </div>
    </>
  )
}

export default Rush