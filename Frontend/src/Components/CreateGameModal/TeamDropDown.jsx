import Select, { components } from 'react-select';
import '../../index.css';

const { Option, SingleValue } = components;

// Custom option for dropdown list
const CustomOption = (props) => (
  <Option {...props}>
    <div className="flex items-center gap-3">
      <img
        src={props.data.logo_url}
        alt={` ${props.data.name} logo`}
        className="w-6 h-6 rounded-full object-cover"
      />
      <div className="flex flex-col leading-tight">
        <span className="font-semibold text-white">{props.data.name}</span>
        <span className="text-xs text-gray-400 mr-auto">{props.data.abbreviation}</span>
      </div>
      <div
        className="ml-auto w-3 h-3 rounded-full"
        style={{ backgroundColor: props.data.color }}
      />
    </div>
  </Option>
);

// Custom display for selected value
const CustomSingleValue = (props) => (
  <SingleValue {...props}>
    <div className="flex items-center gap-2">
      <img
        src={props.data.logo_url}
        alt={`${props.data.name} logo`}
        className="w-5 h-5 rounded-full object-cover"
      />
      <span>{props.data.name}</span>
    </div>
  </SingleValue>
);

function TeamDropDown({ teams, value, onChange }) {
  return (
    <div className="w-72 self-center">
      <Select
        options={teams}
        value={value}
        onChange={onChange}
        isSearchable
        styles={{
          control: (base, state) => ({
            ...base,
            backgroundColor: '#1e293b',
            borderColor: state.isFocused ? '#38bdf8' : '#64748b',
            boxShadow: state.isFocused ? '0 0 0 1px #38bdf8' : 'none',
            '&:hover': { borderColor: '#38bdf8' },
            borderRadius: '0.5rem',
            color: 'white',
          }),
          singleValue: (base) => ({ ...base, color: 'white' }),
          menu: (base) => ({
            ...base,
            backgroundColor: '#1e293b',
            borderRadius: '0.5rem',
            overflow: 'hidden',
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused ? '#334155' : '#1e293b',
            color: 'white',
            cursor: 'pointer',
            padding: '8px 12px',
          }),
        }}
        components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
        placeholder="Select a team..."
      />
    </div>
  );
}

export default TeamDropDown;
