import './PlaySelect.css'
import { useState } from 'react';

import Pass from './Pass';
import Button from './Button';
import Rush from './rush';
import { useDispatch } from 'react-redux';
import { setPenalty, setReturn } from '../../Features/game/gameSlice';
import Kick from './Kick';
import Penalty from './Penalty';

function PlaySelect() {
  const [selectedOption, setSelectedOption] = useState('');

  const dispatch = useDispatch()

  const handleButtonClick = (option) => {
    setSelectedOption(option);
  };

  const setDefault = (option) => {
    if (option != 'penalty') dispatch(setPenalty(false));
    dispatch(setReturn(false))
  }

  return (
    <div className='flex flex-col'>
      <div className='flex flex-row'>
        <Button label={'Pass'} onClick={() =>{ handleButtonClick('Pass'); setDefault()}} isActive={selectedOption === 'Pass'} />
        <Button label={'Run'} onClick={() => {handleButtonClick('Run'); setDefault()}} isActive={selectedOption === 'Run'} />
        <Button label={'Kick'} onClick={() => {handleButtonClick('Kick'); setDefault()}} isActive={selectedOption === 'Kick'} />
        <Button label={'Penalty'} onClick={() => {handleButtonClick('Penalty'); dispatch(setPenalty(true)); setDefault('penalty')}} isActive={selectedOption === 'Penalty'} />
      </div>
      {selectedOption == 'Pass' ? <Pass setFunc={setSelectedOption}/> 
      : selectedOption == 'Run' ? <Rush setFunc={setSelectedOption}/>
      : selectedOption == 'Kick' ? <Kick setFunc={setSelectedOption}/>
      : selectedOption == 'Penalty' ? <Penalty setFunc={setSelectedOption}/>
      : '' }
    </div>
  )
}

export default PlaySelect