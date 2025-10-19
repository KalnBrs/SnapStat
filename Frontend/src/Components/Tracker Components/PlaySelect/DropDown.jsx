import './PlaySelect.css'
import Select from 'react-select';

const customStyles = {
  control: (base) => ({
    ...base,
    backgroundColor: '#1e293b',
    color: 'white',
    borderColor: '#64748b',
  }),
  singleValue: (base) => ({
    ...base,
    color: 'white',
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: '#1e293b',
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? '#334155' : '#1e293b',
    color: 'white',
  }),
}

function DropDown({ options, selectedValue, setSelect }) {
  return (
    <div className='w-50 self-center'>
      <Select options={options} value={selectedValue} onChange={setSelect} isSearchable styles={customStyles} />
    </div>
  )
}

export default DropDown