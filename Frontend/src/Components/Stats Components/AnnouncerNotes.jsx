import { useState } from 'react';

export default function AnnouncerNotes() {
  const [notes, setNotes] = useState('');

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Announcer Notes</h2>
      <textarea
        value={notes}
        onChange={e => setNotes(e.target.value)}
        placeholder="Add notes about players, plays, or teams..."
        className="w-full h-32 bg-gray-700 text-white p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
