import DropDown from "./DropDown"
import Button from "./Button"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setReturn, setPenalty } from "../../../Features/game/gameSlice"
import { setError } from "../../../Features/error/errorSlice"
import { calculateKickDown, generateKickPlayersArray, generateKickResultData, runKick} from '../../../Scripts/sendKick'
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
  const [fairCatch, setFairCatch] = useState(false)
  const [onside, setOnside] = useState(false)

  const [kicker, setKicker] = useState(null)
  const [blocker, setBlocker] = useState(null)
  const [returner, setReturner] = useState(null)

  const [autoFirst, setAutoFirst] = useState(false)

  const dispatch = useDispatch()
  const penCondition = useSelector(state => state.game.penalty)
  const retCondition = useSelector(state => state.game.setReturn)
  const kickNodes = useSelector(state => state.node.offenseNode)
  const retNodes = useSelector(state => state.node.defenseNode)
  const penNodes = useSelector(state => state.node.penaltyNode)
  const homeRoster = useSelector(state => state.roster.home)
  const awayRoster = useSelector(state => state.roster.away)

  const possID = useSelector(state => state.game.game.possession_team_id)
  const gameCondition = useSelector(state => state.game.game)

  const offense = possID == gameCondition.home_team_id ? "home" : "away"
  const options = offense === "home" ? homeRoster : awayRoster;
  const oppOption = offense === "home" ? awayRoster : homeRoster;

  const currentDown = useSelector(state => state.game.game.down)
  const currentDistance = useSelector(state => state.game.game.distance)

  useEffect(() => {

  }, [])

  function setDefault(option) {
    dispatch(setReturn(option.value == 'punt' || option.value == 'kickoff'))
    setMade(false)
    setBlocked(false)
    setFairCatch(false)
    setOnside(false)
    // setPenalty(false)
  }

  function generateKickPlay() {
    const kickYards = (kickNodes.End.x - 50) / 10 - (kickNodes.Start.x - 50) / 10
    const retYards =  -1 * ((retNodes.End.x - 50) / 10 - (retNodes.Start.x - 50) / 10)
    
    console.log("Ret Yards" + retYards)
    let endYard = (kickNodes.End.x - 50) / 10

    // Check for return 
    if (!blocked && !onside && !fairCatch) {
      endYard = (retNodes.End.x - 50) / 10
    }

    if (!kickType) {
      dispatch(setError({ show: true, message: "Please Select a Kick Type" }));
      return null;
    }
    if (!kicker) {
      dispatch(setError({ show: true, message: "Please Select a Kicker" }));
      return null;
    }
    if ((kickType?.label == "Punt" || kickType?.label == "Kick Off")) {
      if (blocked && !blocker) {
        dispatch(setError({ show: true, message: "Please Select a Blocker" }));
        return null;
      }
      if (!blocked && !returner && !onside) {
        dispatch(setError({ show: true, message: "Please Select a Returner" }));
        return null;
      }
    }
    if (blocked && !blocker) {
      dispatch(setError({ show: true, message: "Please Select a Blocker" }));
      return null;
    }

    const playData = {
      kicker,
      returner,
      blocker,
      kickType,
      blocked,
      onside,
      fairCatch,
      made,
      kickYards,
      retYards,
      kickNodes, 
      retNodes,
      penNodes,
      penCondition
    }
    const players = generateKickPlayersArray(playData)
    const resultData = generateKickResultData(playData)

    const downData = {
      ...resultData,
      ...playData
    }
    const newDown = calculateKickDown(downData)

    endYard = (retNodes.End.x - 50)/10
    if (onside) {
      endYard = (kickNodes - 50)/10
    }

    return {
      type: resultData.playType,
      result: resultData.result,
      play_end: (kickNodes.End.x - 50) / 10,
      end_yard: endYard,
      down_to: newDown.down_to,
      distance_to: newDown.distance_to,
      ball_on_yard: newDown.ball_on_yard,
      possession_team_id: possID,
      players,
      isTurnover: newDown.isTurnover,
      defSafety: resultData.defSafety
    }
  }

  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-row my-5">
          <p className='self-center font-bold mx-3'>Kick Type: </p>
          <DropDown options={kickOptions.map(option => option)} selectedValue={kickType} setSelect={(option) => {setKickType(option); setDefault(option)}} />
          <p className='self-center font-bold mx-3'>Kicker: </p>
          <DropDown options={options.map(obj => ({
            ...obj,
            label: `#${obj.number} - ${obj.name}`,
            value: obj.player_id 
            }))} 
            selectedValue={kicker} 
            setSelect={(option) => setKicker(option)} />
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
              {(kickType?.label == "Punt" || kickType?.label == "Kick Off") && <>
                <Button label={'Penalty'} onClick={() => {dispatch(setPenalty(!penCondition)); setAutoFirst(false)}} isActive={penCondition} width={100} margin={0} />
                {penCondition && <Button label={'Auto First Down'} onClick={() => setAutoFirst(true)} isActive={autoFirst} width={150} margin={0} />}
              </>
              }
            </div>
        </div>
      </div>
      <div className="flex flex-row">
        {blocked && <>
          <p className="self-center font-bold mx-3">Blocker: </p>
          <DropDown options={oppOption.map(obj => ({
            ...obj,
            label: `#${obj.number} - ${obj.name}`,
            value: obj.player_id
            }))} 
            selectedValue={blocker}
            setSelect={(option) => setBlocker(option)} />
            </>
          }
          {(kickType?.label == "Punt" || kickType?.label == "Kick Off") && !blocked && !onside && <>
              <p className="self-center font-bold mx-3"> Returner: </p>
              <DropDown options={oppOption.map(obj => ({
                ...obj,
                label: `#${obj.number} - ${obj.name}`,
                value: obj.player_id 
              }))}
              selectedValue={returner}
              setSelect={(option) => setReturner(option)}
              />
            </>
          }
          {(kickType?.label == "Punt" || kickType?.label == "Kick Off") && !blocked && <div className="flex items-center justify-center mx-3">
              <Button label={'Off Recovery'} onClick={() => {setOnside(!onside); dispatch(setReturn(onside))}} isActive={onside} width={200} margin={0} />
              <Button label={'Fair Catch'} onClick={() => {setFairCatch(!fairCatch)}} isActive={fairCatch} width={200} margin={0} />
            </div>
          }
      </div>
      <div className='justify-center'>
        <Button label={'Submit'} show={true} onClick={
          () => {
          const play = generateKickPlay()
          if (!play) {
            return
          }
          dispatch(setReturn(false))
          runKick(play); 
          setFunc('')
        }} />
      </div>
    </>
  )
}

export default Kick