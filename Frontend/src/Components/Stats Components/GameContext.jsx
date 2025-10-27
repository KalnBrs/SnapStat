const prefix = {
  1: 'st',
  2: 'nd',
  3: 'rd',
  4: 'th'
}

export default function GameContext({ context }) {
  const { quarter, down, distance, yardLine, possession, homeTeam, awayTeam } = context;

  return (
    <div className="bg-gray-700 p-4 rounded-lg flex justify-between items-center flex flex-col">
      <p className="text-xl"><b>Quarter:</b> {quarter}</p>
      <p className="text-xl"><b>Down & Distance:</b> {`${down + prefix[down]} & ${distance}`}</p>
      <p className="text-xl"><b>Yard Line:</b> {yardLine}</p>
      <p className="text-xl"><b>Possession:</b> {possession === homeTeam.team_id ? homeTeam.team_name : awayTeam.team_name}</p>
    </div>
  );
}
