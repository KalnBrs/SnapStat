import './PlaySelect.css'
import { useState } from 'react';

import Pass from './Pass';
import Button from './Button';

function PlaySelect({retCondition, rosters, offenseHome, setReturn}) {
  const [selectedOption, setSelectedOption] = useState('optionA');

  const handleButtonClick = (option) => {
    setSelectedOption(option);
  };

  return (
    <div className='flex flex-col'>
      <div className='flex flex-row'>
        <Button label={'Pass'} onClick={() => handleButtonClick('Pass')} isActive={selectedOption === 'Pass'} />
        <Button label={'Run'} onClick={() => handleButtonClick('Run')} isActive={selectedOption === 'Run'} />
        <Button label={'Kick'} onClick={() => handleButtonClick('Kick')} isActive={selectedOption === 'Kick'} />
      </div>
      {selectedOption == 'Pass' ? <Pass 
                                    offenseHome={offenseHome} 
                                    setReturn={setReturn}
                                    retCondition={retCondition}/> 
      : selectedOption == 'Run' ? ('Run') 
      : ('Kick') }
    </div>
  )
}

export default PlaySelect