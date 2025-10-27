import { useState, useEffect } from 'react';
import store from '../../Store/store';
import { setGame } from '../../Features/game/gameSlice';
import '../../index.css'

const DateEditModal = ({ show, onCancel, title = "Adjust Date", initialDate = "" }) => {
  const [date, setDate] = useState(initialDate);

  useEffect(() => {
    if (show) setDate(initialDate); // reset when modal opens
  }, [show, initialDate]);

  const handleSave = async () => {
    try {
      const gamestate = store.getState().game.game;
      const user = store.getState().user.user;

      const res = await fetch(
        `http://localhost:8000/api/games/${gamestate.game_id}/state`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${user.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ date }), // send the new date
        }
      );

      const response = await res.json();

      // Update local game state with any returned info
      store.dispatch(
        setGame({
          ...gamestate,
          game_date: response.game_date || date,
          home_score: response.home_score,
          away_score: response.away_score,
          home_timeouts: response.home_timeouts,
          away_timeouts: response.away_timeouts,
          quarter: response.quarter,
          down: response.down,
          distance: response.distance,
          ball_on_yard: response.ball_on_yard,
          possession_team_id: response.possession_team_id,
        })
      );

      onCancel();
    } catch (err) {
      console.error("Failed to update date:", err);
    }
  };

  if (!show) return null;

  return (
    <div className="modal-overlay fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-96">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-black">{title}</h2>
          <button
            onClick={onCancel}
            className="text-red-500 hover:text-red-700 font-bold text-xl"
          >
            ×
          </button>
        </div>

        {/* Date Input */}
        <div className="flex flex-col gap-2 mb-6">
          <label className="text-black font-medium">Game Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border border-black rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateEditModal;
