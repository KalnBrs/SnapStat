const prefix = {
  1: 'st',
  2: 'nd',
  3: 'rd',
  4: 'th'
}

export default function PlaySummary({ plays, homeTeam, awayTeam }) {

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Play Summaries</h2>
      <ul className="space-y-2">
        {plays.map((p, i) => (
          <li key={i} className="bg-gray-700 p-3 rounded-lg">
            <div className="flex flex-row">
              <p className="mr-auto ml-3 text-xs">{p.play_type.toUpperCase()}</p>
              <p className="ml-auto mr-3 text-xs">{p.result}</p>
            </div>
            <div className="flex flex-row">
              <p className="ml-2 mr-auto">Start Yard: {p.start_yard}</p>
              <p className="mr-2 ml-auto">End Yard: {p.end_yard}</p>
            </div>
            <div className="flex flex-row items-center">
              <p className="ml-2 mr-auto">To: {`${p.down + prefix[p.down]} & ${p.distance}`}</p>
              <div style={{backgroundColor: p.team_id == homeTeam.team_id ? homeTeam.color : awayTeam.color}} className="w-5 h-5 rounded-lg"></div>
              <p className="mr-2 ml-1 text-sm ">{p.team_id == homeTeam.team_id ? homeTeam.team_name : awayTeam.team_name}</p>
            </div>
            <p></p>
          </li>
        ))}
      </ul>
    </div>
  );
}
