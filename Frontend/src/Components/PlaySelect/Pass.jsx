import { useState } from 'react'
import DropDown from './DropDown'

import './PlaySelect.css'    
import Button from './Button'
import { useDispatch, useSelector } from 'react-redux'
import { setPenalty, setReturn } from '../../Features/game/gameSlice'
import { sendPass, calculateNextDownAndDistance } from '../../Scripts/sendPass'

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

  const nodes = useSelector(state => state.node.offenseNode)
  const retNodes = useSelector(state => state.node.defenseNode)
  const penNodes = useSelector(state => state.node.penaltyNode)

  const currentDown = useSelector(state => state.game.game.down)
  const currentDistance = useSelector(state => state.game.game.distance)

  function generatePassPlay() {
    const startYard = (nodes.Start.x - 50) / 10;
    const endYardPass = (nodes.End.x - 50) / 10;
    const penaltyYards = penCondition ? ((penNodes.End.x - 50) - (penNodes.Start.x - 50)) / 10 : 0;
    const endYardFinal = endYardPass + penaltyYards;

    // Initialize players array
    const players = [
        { player_id: qbSelect.player_id, role: "passer", value: endYardPass - startYard },
        { player_id: wrSelect.player_id, role: "receiver", value: endYardPass - startYard }
    ];

    // Tackler (if completion or return occurs)
    if (!incomplete && tackSelect) {
        players.push({ player_id: tackSelect.player_id, role: "tackler", value: 1 });
    }

    // Turnover stats
    if (retCondition && retType === "Interception" && intercepter) {
        players.push({ player_id: intercepter.player_id, role: "interceptor", value: 1 });
    }
    if (retCondition && retType === "Fumble" && fumbleRecoverer) {
        players.push({ player_id: fumbleRecoverer.player_id, role: "fumble_recoverer", value: 1 });
    }

    // Determine result
    let result;
    let touchdown = false;
    let defenseScore = false;
    let touchback = false;

    // Offensive touchdown
    if (!incomplete && !retCondition && endYardFinal >= 100) {
        result = "Touchdown";
        touchdown = true;
    }
    // Defensive score
    else if (retCondition && (retType === "Interception" || retType === "Fumble") && (retNodes.End.x - 50)/10 >= 100) {
        defenseScore = true;
        if (retType === "Interception") result = "Pick-Six";
        else result = "Scoop and Score";
    }
    // Regular turnover (no TD)
    else if (retCondition && retType === "Interception") result = "Interception";
    else if (retCondition && retType === "Fumble") result = "Fumble";
    // Incomplete
    else if (incomplete) result = "Incomplete";
    // Normal completion
    else result = "Completion";

    // Touchback check (if defensive return ends in end zone)
    if (retCondition && (retType === "Interception" || retType === "Fumble") && (retNodes.End.x - 50)/10 === 0) {
        touchback = true;
    }

    // Determine next play setup
    const nextPlay = calculateNextDownAndDistance(
        currentDown,
        currentDistance,
        startYard,
        endYardFinal,
        retCondition && !defenseScore, // turnover flag (excluding defensive TD)
        touchdown,
        touchback,
        defenseScore
    );

    return {
        type: "pass",
        result,
        play_end: endYardPass,
        end_yard: endYardFinal,
        down_to: nextPlay.down_to,
        distance_to: nextPlay.distance_to,
        ball_on_yard: nextPlay.ball_on_yard,
        players
    };
}

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
        <Button label={'Submit'} show={true} onClick={() => {console.log(generatePassPlay()); setFunc('')}} />
      </div>
    </>
  )
}

export default Pass