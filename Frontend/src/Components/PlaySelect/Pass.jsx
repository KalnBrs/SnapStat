import { useState } from 'react'
import DropDown from './DropDown'

import './PlaySelect.css'    
import Button from './Button'
import { useDispatch, useSelector } from 'react-redux'
import { setPenalty, setReturn } from '../../Features/game/gameSlice'

const retTypes = [ { 
    label: "Fumble", 
    value: "fumble" 
  }, {
    label: "Interception",
    value: "interception"
  }]

function Pass({setFunc}) {
  const [qbSelect, setQBSelect] = useState()
  const [wrSelect, setWRSelect] = useState()
  const [tackSelect, setTackSelect] = useState()
  const [intercepter, setIntercepter] = useState()
  const [fumbleRecoverer, setFumbleRecoverer] = useState()

  const [autoFirst, setAutoFirst] = useState(false)

  const [retType, setRetType] = useState()

  const [incomplete, setIncomplete] = useState(false)

  const homeRoster = useSelector(state => state.roster.home)
  const awayRoster = useSelector(state => state.roster.away)
  const retCondition = useSelector(state => state.game.return)
  const penCondition = useSelector(state => state.game.penalty)
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
            <Button label={'Penalty'} onClick={() => {dispatch(setPenalty(!penCondition)); setAutoFirst(false)}} isActive={penCondition} width={100} margin={0} />
            {penCondition && <Button show={penCondition} label={'Auto First Down'} onClick={() => setAutoFirst(true)} isActive={autoFirst} width={150} margin={0} />}
            

            { retCondition &&
                              <>
                                <p className='self-center font-bold mx-3'>Type: </p>
                                <DropDown 
                                  options={retTypes.map(retType => retType)} 
                                  selectedValue={retType} 
                                  setSelect={(option) => setRetType(option)} 
                                />
                              </>
            }
          </div>
        </div>
        <div className='flex flex-row my-5'>
          {!incomplete && !retCondition && <>
          <p className='self-center font-bold mx-3'>Tackler: </p>
          <DropDown options={oppOption.map(obj => ({
            ...obj,
            label: `#${obj.number} - ${obj.name}`,
            value: obj.player_id 
            }))} 
            selectedValue={tackSelect} 
            setSelect={(option) => setTackSelect(option)} />
            </>
          }
          {retType?.value === "interception" && <>
            <p className='self-center font-bold mx-3'>Intercepter: </p>
            <DropDown options={oppOption.map(obj => ({
              ...obj,
              label: `#${obj.number} - ${obj.name}`,
              value: obj.player_id 
              }))} 
              selectedValue={intercepter} 
              setSelect={(option) => setIntercepter(option)} />
              </>
          }
          {retType?.value === "fumble" && <>
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

export default Pass