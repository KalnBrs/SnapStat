import { useState, useEffect } from 'react';
import store from '../../../Store/store';
import { setGame } from '../../../Features/game/gameSlice';
import './AdjustModal.css'

const options = [
  "home_score",
  "away_score",
  "home_timeouts",
  "away_timeouts",
  "quarter",
  "down",
  "distance",
  "ball_on_yard",
  "current_drive_id"
]

const onSave = async (resultObj) => {
  const gamestate = store.getState().game.game
  const user = store.getState().user.user
  const res = await fetch(`http://localhost:8000/api/games/${gamestate.game_id}/state`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${user.accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(resultObj)
  });
  return await res.json();
}

const AdjustModal = ({ show, onCancel, title, message, initialValues = [] }) => {
  const [values, setValues] = useState([])

  useEffect(() => {
    if (show) setValues(initialValues);
  }, [show]);

  const handleAdd = () => {
    setValues([...values, { name: "", value: "" }]);
  }

  const handleChange = (index, field, newValue) => {
    const updated = [...values];
    updated[index][field] = newValue;
    setValues(updated);
  };

  const handleRemove = (index) => {
    setValues(values.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    const game = store.getState().game.game
    const cleaned = values.filter(v => v.name.trim() !== "");

    // Turn the array into an object
    const resultObj = cleaned.reduce((acc, curr) => {
      acc[curr.name] = curr.value;
      return acc;
    }, {});
    
    const response = await onSave(resultObj);
    store.dispatch(
      setGame({
        ...game,
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
  };

  // compute which options are already chosen, to disable them in dropdowns
  const usedOptions = values.map(v => v.name);

  if (!show) return null; // Don't render if not visible

  return (
    <div className="modal-overlay">
      <div className="bg-white p-5 rounded-md shadow-sm text-center max-w-lg w-4/5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-black">
            Adjust Values:
          </h2>
          <button
            onClick={onCancel}
            className="text-red-500 hover:text-white justify-center text-xl font-bold px-2"
          >
            ×
          </button>
        </div>

        {/* Value list */}
        <div className="space-y-3 max-h-[60vh] overflow-y-auto overflow-x-hidden w-full">
          {values.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 border rounded-lg p-2 bg-gray-100 w-full shadow-sm"
            >
              {/* Dropdown for selecting field name */}
              <select
                value={item.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
                className="flex-1 border rounded-lg p-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-black border-black"
              >
                <option value="">Select Field</option>
                {options.map(opt => (
                  <option
                    key={opt}
                    value={opt}
                    disabled={usedOptions.includes(opt) && item.name !== opt}
                  >
                    {opt}
                  </option>
                ))}
              </select>

              {/* Input for the value */}
              <input
                type="number"
                placeholder="Value"
                value={item.value}
                onChange={(e) => handleChange(index, "value", e.target.value)}
                className="w-24 border rounded-lg p-2 focus:outline-none focus:ring-2 text-black focus:ring-blue-500 border-black"
              />

              {/* Remove button */}
              <button
                onClick={() => handleRemove(index)}
                className="text-red-500 hover:text-red-700 text-lg font-bold px-2"
              >
                ✕
              </button>
            </div>
          ))}

          <button
            onClick={handleAdd}
            className="w-full mt-2 py-2 rounded-lg border border-dashed border-blue-500 text-blue-600 hover:bg-blue-50 font-medium"
          >
            + Add Value
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={async () => await handleSave(values)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdjustModal;
