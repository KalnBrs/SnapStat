import './PlaySelect.css'
import { useState } from 'react';

import Pass from './Pass';
import Button from './Button';
import Rush from './rush';
import { useDispatch } from 'react-redux';
import { setReturn } from '../../Features/game/gameSlice';

function PlaySelect() {
  const [selectedOption, setSelectedOption] = useState('optionA');

  const dispatch = useDispatch()

  const handleButtonClick = (option) => {
    setSelectedOption(option);
  };

  return (
    <div className='flex flex-col'>
      <div className='flex flex-row'>
        <Button label={'Pass'} onClick={() =>{ handleButtonClick('Pass'); dispatch(setReturn(false))}} isActive={selectedOption === 'Pass'} />
        <Button label={'Run'} onClick={() => {handleButtonClick('Run'); dispatch(setReturn(false))}} isActive={selectedOption === 'Run'} />
        <Button label={'Kick'} onClick={() => {handleButtonClick('Kick'); dispatch(setReturn(false))}} isActive={selectedOption === 'Kick'} />
      </div>
      {selectedOption == 'Pass' ? <Pass /> 
      : selectedOption == 'Run' ? <Rush />
      : ('Kick') }
    </div>
  )
}

export default PlaySelect