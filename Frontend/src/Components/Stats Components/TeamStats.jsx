export default function TeamStats({ teams }) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Team Comparison</h2>
      <div className="grid grid-cols-2 text-center">
        {teams.map(team => (
          <div key={team.id}>
            <h3 className="text-xl font-bold mb-2">{team.name}</h3>
            <p>Total Yards: {team.totalYards}</p>
            <p>Possession: {team.possessionTime}</p>
            <p>Turnovers: {team.turnovers}</p>
            <p>Penalties: {team.penalties}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
