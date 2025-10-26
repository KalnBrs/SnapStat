import { useEffect, useState } from 'react';
import '../../index.css';
import { getTeams } from '../../Scripts/login';
import TeamDropDown from './TeamDropDown';
import { startGame } from '../../Scripts/gameSelectUtilities';
import { useNavigate } from 'react-router-dom';

function CreateGameModal({ show, onConfirm, onCancel }) {
  const [teams, setTeams] = useState([]);
  const [homeTeam, setHomeTeam] = useState(null);
  const [awayTeam, setAwayTeam] = useState(null);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchTeams() {
      const data = await getTeams();
      const formattedTeams = data.map((team) => ({
        value: team.team_id,
        label: team.team_name,
        name: team.team_name,
        abbreviation: team.abbreviation,
        color: team.color,
        logo_url: team.logo_url,
        team_id: team.team_id
      }));
      setTeams(formattedTeams);
    }
    fetchTeams();
  }, []);

  if (!show) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!homeTeam || !awayTeam) return setError('Please select both Home and Away teams.');
    if (homeTeam.value === awayTeam.value) return setError('Home and Away teams must be different.');

    console.log('Home:', homeTeam, 'Away:', awayTeam);
    try {
      const game = await startGame(homeTeam.team_id, awayTeam.team_id)
      console.log(game)
      setAwayTeam(null)
      setHomeTeam(null)
      navigate(`/tracker/${game.game_id}`)
    } catch (err) {
      return setError('Error creating/starting game, please reload')
    }
    
  };

  return (
    <div className="modal-overlay fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="modal-content bg-white rounded-lg p-6 w-96 shadow-lg">
        <h3 className="font-bold text-black text-lg mb-4">Create a Game</h3>

        {error && <p style={{color: '#DD1C1A'}} className="text-red-500 text-sm mb-3">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="mr-4 text-lg font-medium text-bold text-black">Home Team:</label>
            <TeamDropDown teams={teams} value={homeTeam} onChange={setHomeTeam} />
          </div>

          <div className="flex items-center justify-between">
            <label className="mr-4 text-lg font-medium text-bold text-black">Away Team:</label>
            <TeamDropDown teams={teams} value={awayTeam} onChange={setAwayTeam} />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm w-100">
              Save
            </button>
            <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateGameModal;
