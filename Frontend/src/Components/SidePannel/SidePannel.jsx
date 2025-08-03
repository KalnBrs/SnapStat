import { useState } from 'react'

import ConfirmationModal from '../ConfirmationModal'

import './SidePannel.css'
import { useDispatch, useSelector } from 'react-redux';
import { setGame } from '../../Features/game/gameSlice';
import { setError } from '../../Features/error/errorSlice';

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

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationTeam, setConfirmationTeam] = useState(null)
  const [confirmationTeamValue, setConfirmationTeamValue] = useState('')

  const [selectedValue, setSelectedValue] = useState(gameState.quarter)
  const [showQuarter, setShowQuarter] = useState(false)

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleQuarterOpen = () => { setShowQuarter(true) }

  const handleQuarterConfirm = () => { 
    dispatch(setGame({
      ...gameState,
      quarter: selectedValue
    }))
    setShowQuarter(false) 
  }

  const handleQuarterClose = () => { setShowQuarter(false) }

  const handleOpenConfermation = (team) => {
    setConfirmationTeamValue(team.team_id == homeTeam.team_id ? 'home_timeouts' : 'away_timeouts')
    setConfirmationTeam(team)
    setShowConfirmation(true)
  }

  const handleConfirm = () => {
    if (gameState[confirmationTeamValue] <= 0) {
      dispatch(setError({show: true, message: 'This team has reached 0 timeouts'}))
      handleClose()
      return
    }
    dispatch(setGame({
      ...gameState,
      [confirmationTeamValue]: gameState[confirmationTeamValue] - 1
    }))
    // Update Timeouts
    handleClose()
  }

  const handleClose = () => {
    setConfirmationTeamValue('')
    setShowConfirmation(false)
    setConfirmationTeam(false)
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
      <label className='topic pb-2' htmlFor="my-select">Choose an option:</label>
      <select className='quarterSelect' id="my-select" value={selectedValue} onChange={handleChange}>
        <option value="1">1st</option>
        <option value="2">2nd</option>
        <option value="3">3rd</option>
        <option value="4">4th</option>
      </select>
      <button className='quarterButton' onClick={handleQuarterOpen}>Update Quarter</button> 
      <button className='mt-5' onClick={() => handleOpenConfermation(homeTeam)} style={{backgroundColor: homeTeam.color}}>{homeTeam.abbreviation + ' Timeout'}</button>
      <button className='mt-5' onClick={() => handleOpenConfermation(awayTeam)} style={{backgroundColor: awayTeam.color}}>{awayTeam.abbreviation + ' Timeout'}</button>
    </div>
    <ConfirmationModal
      show={showConfirmation}
      onConfirm={handleConfirm}
      onCancel={handleClose}
      title="Confirm Timeout"
      message={`Are you sure ${confirmationTeam?.team_name} called a timeout?`}
    />
  </>
  )
}

export default SidePannel