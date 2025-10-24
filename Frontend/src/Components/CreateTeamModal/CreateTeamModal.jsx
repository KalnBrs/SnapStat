import { useState } from 'react';
import "../../index.css"
import { postTeam } from '../../Scripts/teamApi';

function CreateTeamModal({ show, onConfirm, onCancel }) {
  const [teamName, setTeamName] = useState('');
  const [abbreviation, setAbbreviation] = useState('');
  const [color, setColor] = useState('#000000');
  const [logoUrl, setLogoUrl] = useState('');
  const [error, setError] = useState('');

  if (!show) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!teamName.trim()) {
      setError('Team name is required.');
      return;
    }

    if (!abbreviation.trim()) {
      setError('Abbreviation is required.');
      return;
    }

    if (abbreviation.length > 4) {
      setError('Abbreviation must be 4 characters or fewer.');
      return;
    }

    const colorRegex = /^#[0-9A-F]{6}$/i;
    if (!colorRegex.test(color)) {
      setError('Color must be in the format #RRGGBB (e.g., #A1B2C3).');
      return;
    }

    const teamData = { "team_name": teamName, "abbreviation": abbreviation, "color": color, "logo_url": logoUrl };
    try {
      await postTeam(teamData)
      setTeamName('');
      setAbbreviation('');
      setColor('#000000');
      setLogoUrl('');
      onConfirm()
    } catch (err) {
      setError('Failed to get team, please reload the page')
    }

    
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content rounded-lg p-4 bg-white">
        <h3 className="font-bold text-black mb-3">Create a Team:</h3>

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

export default CreateTeamModal;