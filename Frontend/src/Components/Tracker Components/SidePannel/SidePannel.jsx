import { useState } from 'react'

import ConfirmationModal from '../../ConfirmationModal'

import './SidePannel.css'
import { useDispatch, useSelector } from 'react-redux';
import { setGame } from '../../../Features/game/gameSlice';
import { setError } from '../../../Features/error/errorSlice';
import { flipPoss, updateFinished, updateQuarter, updateTimeout } from '../../../Scripts/sideBarUtilities';
import AdjustModal from '../AdjustModal';
import DateEdit from '../DateEdit';

const prefix = {
  1: 'st',
  2: 'nd',
  3: 'rd',
  4: 'th'
}

function SidePannel() {
  const homeTeam = useSelector(state => state.team.home)
  const awayTeam = useSelector(state => state.team.away)
  const gameState = useSelector(state => state.game.game)
  const dispatch = useDispatch()

  const [showAdjust, setShowAdjust] = useState(false)

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationTeam, setConfirmationTeam] = useState(null)
  const [confirmationTeamValue, setConfirmationTeamValue] = useState('')

  const [selectedValue, setSelectedValue] = useState(gameState.quarter)
  const [showQuarter, setShowQuarter] = useState(false)

  const [showFinished, setShowFinished] = useState(false)
  const [showDate, setShowDate] = useState(false)

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleQuarterOpen = () => { setShowQuarter(true) }

  const handleQuarterConfirm = async () => { 
    const backendGameState = await updateQuarter(selectedValue)
    dispatch(setGame(
      backendGameState
    ))
    setShowQuarter(false) 
  }

  const handleQuarterClose = () => { setShowQuarter(false) }

  const handleOpenConfermation = (team) => {
    setConfirmationTeamValue(team.team_id == homeTeam?.team_id ? 'home_timeouts' : 'away_timeouts')
    setConfirmationTeam(team)
    setShowConfirmation(true)
  }

  const handleConfirm = async () => {
    if (gameState[confirmationTeamValue] <= 0) {
      dispatch(setError({show: true, message: 'This team has reached 0 timeouts'}))
      handleClose()
      return
    }
    const backendGameState = await updateTimeout(confirmationTeamValue, gameState[confirmationTeamValue] - 1)
    dispatch(setGame(backendGameState))
    // Update Timeouts
    handleClose()
  }

  const handleClose = () => {
    setConfirmationTeamValue('')
    setShowConfirmation(false)
    setConfirmationTeam(false)
  }

  const handleAdjustOpen = () => {
    setShowAdjust(true)
  }

  const handleAdjustClose = () => {
    setShowAdjust(false)
  }

  const flipPossesion = async () => {
    const homeTeamId = homeTeam.team_id
    const awayTeamId = awayTeam.team_id
    const posId = gameState.possession_team_id
    dispatch(setGame(await flipPoss(posId == homeTeamId ? awayTeamId : homeTeamId)))
  }

  const confirmFinishModal = async () => {
    dispatch(setGame(await updateFinished(!gameState.finished)))
    setShowFinished(false)
  }

  return (
    <>
    <ConfirmationModal
      show={showQuarter}
      onConfirm={handleQuarterConfirm}
      onCancel={handleQuarterClose}
      title="Confirm Quarter Change"
      message={`Are you sure the quarter is over?`}
    />
    <div className='flex flex-col'>
      <p className='topic'>Down & Distance:</p>
      <p>{`${gameState.down + prefix[gameState.down]} & ${gameState.distance}`}</p>
      <div className='break' />
      <label className='topic pb-2' htmlFor="my-select">Choose a Quarter:</label>
      <select className='quarterSelect' id="my-select" value={selectedValue} onChange={handleChange}>
        <option value="1">1st</option>
        <option value="2">2nd</option>
        <option value="3">3rd</option>
        <option value="4">4th</option>
      </select>
      <button className='quarterButton' onClick={handleQuarterOpen}>Update Quarter</button> 
      <button className='mt-3' onClick={() => handleOpenConfermation(homeTeam)} style={{backgroundColor: homeTeam?.color}}>{homeTeam?.abbreviation + ' Timeout'}</button>
      <button className='mt-3' onClick={() => handleOpenConfermation(awayTeam)} style={{backgroundColor: awayTeam?.color}}>{awayTeam?.abbreviation + ' Timeout'}</button>
      <button className='mt-3' onClick={() => handleAdjustOpen(awayTeam)} >Open Adjust Modal</button>
      <button className='mt-3' onClick={() => flipPossesion()}>Flip Possesion</button>
      <div className='break' />
      <button style={{backgroundColor: '#3F2A2B'}} className='' onClick={() => setShowDate(true)}>Change Date</button>
      {gameState.finished ? 
        <button className='mt-2' style={{backgroundColor: 'green'}} onClick={() => setShowFinished(true)}>Restart Game</button>  
        : <button className='mt-2' style={{backgroundColor: '#E15554'}} onClick={() => setShowFinished(true)}>Finish Game</button>}
    </div>
    <ConfirmationModal
      show={showFinished}
      onConfirm={confirmFinishModal}
      onCancel={() => setShowFinished(false)}
      title={gameState.finished ? "Restart Game" : "Finish Game"}
      message={gameState.finished ? "Are you sure you want to restart" : "Are you sure you want to finish the game"}
    />
    <ConfirmationModal
      show={showConfirmation}
      onConfirm={handleConfirm}
      onCancel={handleClose}
      title="Confirm Timeout"
      message={`Are you sure ${confirmationTeam?.team_name} called a timeout?`}
    />
    <AdjustModal
      show={showAdjust}
      onCancel={handleAdjustClose}
    />
    <DateEdit 
      show={showDate}
      onCancel={() => setShowDate(false)}
    />
  </>
  )
}

export default SidePannel