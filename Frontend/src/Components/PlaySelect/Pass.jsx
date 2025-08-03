import { useState } from 'react'
import DropDown from './DropDown'

import './PlaySelect.css'    
import Button from './Button'
import { useDispatch, useSelector } from 'react-redux'
import { setReturn } from '../../Features/game/gameSlice'

function Pass() {
  const [qbSelect, setQBSelect] = useState()
  const [wrSelect, setWRSelect] = useState()
  const [tackSelect, setTackSelect] = useState()

  const [incomplete, setIncomplete] = useState(false)

  const homeRoster = useSelector(state => state.roster.home)
  const awayRoster = useSelector(state => state.roster.away)
  const retCondition = useSelector(state => state.game.return)
  const offense = useSelector(state => state.game.offense)
  const dispatch = useDispatch()

  const options = offense === "home" ? homeRoster : awayRoster;
  const oppOption = offense === "home" ? awayRoster : homeRoster;

  return (
    <>
      <div className='flex flex-col'>
        <div className='flex flex-row my-5'>
          <p className='self-center font-bold mx-3'>QB: </p>
          <DropDown options={options.map(obj => ({
            ...obj,
            label: `#${obj.number} - ${obj.name}`,
            value: obj.player_id 
            }))} 
            selectedValue={qbSelect} 
            setSelect={(option) => setQBSelect(option)} />
          <p className='self-center font-bold mx-3'>WR: </p>
          <DropDown options={options.map(obj => ({
            ...obj,
            label: `#${obj.number} - ${obj.name}`,
            value: obj.player_id 
            }))} 
            selectedValue={wrSelect} 
            setSelect={(option) => setWRSelect(option)} />
          <div className='flex items-center justify-center mx-3'>
            <Button label={'Incomplete'} onClick={() => {setIncomplete(!incomplete); dispatch(setReturn(false))}} isActive={incomplete} width={200} margin={0} />
            <Button label={'Turnover'} onClick={() => {setIncomplete(false); dispatch(setReturn(!retCondition))}} isActive={retCondition} width={200} margin={0} />
          </div>
        </div>
        <div className='flex flex-row my-5'>
          <p className='self-center font-bold mx-3'>Tackler: </p>
          <DropDown options={oppOption.map(obj => ({
            ...obj,
            label: `#${obj.number} - ${obj.name}`,
            value: obj.player_id 
            }))} 
            selectedValue={tackSelect} 
            setSelect={(option) => setTackSelect(option)} />
        </div>
      </div>
    </>
  )
}

export default Pass