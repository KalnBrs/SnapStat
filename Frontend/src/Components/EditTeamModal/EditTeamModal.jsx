import { useEffect, useState } from 'react';
import "../../index.css"
import { updateTeam } from '../../Scripts/teamApi';
import { clearTeam } from '../../Scripts/teamApi';

function EditTeamModal({ show, onConfirm, onCancel, team }) {
  const [teamName, setTeamName] = useState(team?.team_name);
  const [abbreviation, setAbbreviation] = useState(team?.abbreviation);
  const [color, setColor] = useState(team?.color);
  const [logoUrl, setLogoUrl] = useState(team?.logo_url);
  const [csvFile, setCsvFile] = useState(null);
  const [error, setError] = useState('');

  const [clearText, setClearText] = useState('Clear Team?');
  const [change, setChange] = useState(false)
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setTeamName(team?.team_name || '');
    setAbbreviation(team?.abbreviation || '');
    setColor(team?.color || '');
    setLogoUrl(team?.logo_url || '');
  }, [show, team]);

  if (!show) return null;

  async function onClear(e) {
    e.preventDefault();
    if (change) {
      // Clear the team
      await clearTeam(team);
  
      // Trigger the "grow green" animation
      setAnimating(true);
  
      // Reset text and animation after 1s
      setTimeout(() => {
        setClearText('Clear Team?');
        setChange(false);
        setAnimating(false);
      }, 1000);
    } else {
      setClearText("Are you sure?");
      setChange(true);
  
      // Revert text after 2s
      setTimeout(() => {
        setClearText('Clear Team?');
        setChange(false);
      }, 2000);
    }
  }
  

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!teamName.trim()) return setError('Team name is required.');
    if (!abbreviation.trim()) return setError('Abbreviation is required.');
    if (abbreviation.length > 4) return setError('Abbreviation must be 4 characters or fewer.');

    const colorRegex = /^#[0-9A-F]{6}$/i;
    if (!colorRegex.test(color)) return setError('Color must be in the format #RRGGBB (e.g., #A1B2C3).');

    try {
      console.log(team)
      const formData = new FormData();
      formData.append('team_name', teamName);
      formData.append('abbreviation', abbreviation);
      formData.append('color', color);
      formData.append('logo_url', logoUrl);
      formData.append('team_id', team.team_id);
      if (csvFile) formData.append('player_csv', csvFile); // add the file if it exists

      console.log(await updateTeam(formData, team));

      setTeamName('');
      setAbbreviation('');
      setColor('#000000');
      setLogoUrl('');
      setCsvFile(null);
      onConfirm();
    } catch (err) {
      console.log(err)
      setError('Failed to upload team or CSV. Please reload and try again.');
    }
    }

  return (
    <div className="modal-overlay">
      <div className="modal-content rounded-lg p-4 bg-white">
        <h3 className="font-bold text-black mb-3">Edit {team.team_name}:</h3>

        <form onSubmit={handleSubmit}>
          <div className="flex flex-row items-center gap-4">
            <input
              className="w-full text-black pl-2 border-gray-400 border-2 rounded-lg my-2"
              type="text"
              placeholder="Team Name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              required
            />
            <input
              className="w-full text-black pl-2 border-gray-400 border-2 rounded-lg my-1"
              type="text"
              placeholder="Abbreviation (max 4)"
              value={abbreviation}
              onChange={(e) => setAbbreviation(e.target.value.toUpperCase())}
              maxLength={4}
              required
            />
          </div>

          <div className="flex flex-row items-center">
            <label className="text-black mr-5">Color:</label>
            <input
              className="w-full text-black pl-2 border-gray-400 border-2 rounded-lg my-1"
              type="text"
              placeholder="#A1B2C3"
              value={color}
              onChange={(e) => setColor(e.target.value.toUpperCase())}
            />
          </div>

          <input
            className="w-full text-black pl-2 border-gray-400 border-2 rounded-lg my-1"
            type="text"
            placeholder="Logo URL (optional)"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
          />
          <div className="flex flex-col mt-3">
            <label className="text-black mb-1  font-medium">Upload Players CSV (optional):</label>
            <div className='flex flex-row items-center'>
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setCsvFile(e.target.files[0])}
                className="text-black border-2 border-gray-400 rounded-lg w-60 mr-auto"
              />
              <button
                type='button'
                onClick={onClear}
                style={{backgroundColor: clearText == "Are you sure?" ? "red" : "gray"}}
                className={`ml-auto transition-all duration-300 rounded px-2 py-1 ${
                  animating ? 'swipe-green' : 'bg-gray-200 text-black'
                }`}
              >
                {clearText}
              </button>
            </div>
          </div>

          {error && <p className="mt-2 error">{error}</p>}

          <div className="modal-actions flex justify-center gap-3 mt-3">
            <button
              type="submit"
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Confirm
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditTeamModal;