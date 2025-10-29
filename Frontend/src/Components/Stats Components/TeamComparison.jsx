import { useEffect, useState } from 'react';
import '../../index.css';
import { getTeamsGameData } from '../../Scripts/gameSelectUtilities';

export default function TeamComparison({ gameID, homeTeam, awayTeam }) {
  const [showFull, setShowFull] = useState(false);
  const [homeTeamStats, setHomeTeamStats] = useState(null);
  const [awayTeamStats, setAwayTeamStats] = useState(null);

  // Fetch stats only
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getTeamsGameData(gameID);
        setHomeTeamStats(data.home || null);
        setAwayTeamStats(data.away || null);
      } catch (err) {
        console.error('Failed to fetch team data', err);
      }
    }
    if (gameID) fetchData();
  }, [gameID]);

  if (!homeTeamStats && !awayTeamStats) return null;

  const parseStat = (value) => (value ? Number(value) : 0);

  const getPercentage = (homeValue, awayValue) => {
    const total = homeValue + awayValue;
    if (total === 0) return { home: 50, away: 50 };
    return {
      home: (homeValue / total) * 100,
      away: (awayValue / total) * 100,
    };
  };

  // Announcer-focused stats
  const announcerStats = [
    { key: 'passing_yards', label: 'Passing Yards' },
    { key: 'passing_td', label: 'Passing TDs' },
    { key: 'run_yards', label: 'Rushing Yards' },
    { key: 'run_td', label: 'Rushing TDs' },
    { key: 'rec_yards', label: 'Receiving Yards' },
    { key: 'rec_td', label: 'Receiving TDs' },
    { key: 'turnovers', label: 'Turnovers' }, // fumbles + interceptions
    { key: 'tackles', label: 'Tackles' },
    { key: 'sacks', label: 'Sacks' },
    { key: 'fg_makes', label: 'FG Made' },
    { key: 'extra_made', label: 'Extra Points Made' },
  ];

  const fullStatGroups = [
    {
      label: 'Offense',
      stats: [
        { key: 'completions', label: 'Completions' },
        { key: 'attempts', label: 'Attempts' },
        { key: 'passing_yards', label: 'Passing Yards' },
        { key: 'passing_td', label: 'Passing TDs' },
        { key: 'passing_int', label: 'Interceptions' },
        { key: 'sacked', label: 'Times Sacked' },
        { key: 'carries', label: 'Carries' },
        { key: 'run_yards', label: 'Rushing Yards' },
        { key: 'run_td', label: 'Rushing TDs' },
        { key: 'receptions', label: 'Receptions' },
        { key: 'targets', label: 'Targets' },
        { key: 'rec_yards', label: 'Receiving Yards' },
        { key: 'rec_td', label: 'Receiving TDs' },
        { key: 'fumbles', label: 'Fumbles Lost' },
        { key: 'def_td', label: 'Defensive TDs' },
      ],
    },
    {
      label: 'Defense',
      stats: [
        { key: 'tackles', label: 'Tackles' },
        { key: 'sacks', label: 'Sacks' },
        { key: 'interceptions', label: 'Interceptions' },
        { key: 'fumble_recovery', label: 'Fumble Recoveries' },
      ],
    },
    {
      label: 'Special Teams',
      stats: [
        { key: 'punt_attempts', label: 'Punts' },
        { key: 'punt_yard', label: 'Punt Yards' },
        { key: 'punt_long', label: 'Longest Punt' },
        { key: 'return_attempts', label: 'Returns' },
        { key: 'return_yards', label: 'Return Yards' },
        { key: 'return_touchdown', label: 'Return TDs' },
        { key: 'fg_attempts', label: 'FG Attempts' },
        { key: 'fg_makes', label: 'FG Made' },
        { key: 'fg_long', label: 'Longest FG' },
        { key: 'extra_made', label: 'Extra Points Made' },
        { key: 'extra_missed', label: 'Extra Points Missed' },
        { key: 'punt_block', label: 'Punts Blocked' },
        { key: 'fg_block', label: 'FG Blocked' },
        { key: 'extra_block', label: 'Extra Blocked' },
        { key: 'onside_attempts', label: 'Onside Kicks' },
        { key: 'onside_successful', label: 'Successful Onside' },
        { key: 'kickoff_yards', label: 'Kickoff Yards' },
        { key: 'kickoff_attempts', label: 'Kickoffs' },
      ],
    },
  ];

  const renderStats = (stats) =>
    stats.map(({ key, label }) => {
      const homeValue = homeTeamStats ? parseStat(homeTeamStats[key]) : 0;
      const awayValue = awayTeamStats ? parseStat(awayTeamStats[key]) : 0;

      const finalHome = key === 'turnovers'
        ? homeTeamStats ? parseStat(homeTeamStats.fumbles) + parseStat(homeTeamStats.passing_int) : 0
        : homeValue;

      const finalAway = key === 'turnovers'
        ? awayTeamStats ? parseStat(awayTeamStats.fumbles) + parseStat(awayTeamStats.passing_int) : 0
        : awayValue;

      const { home, away } = getPercentage(finalHome, finalAway);

      return (
        <div key={key} className="mb-3">
          <div className="flex justify-between text-sm font-semibold mb-1">
            <span>{awayTeam?.team_name || '—'}: {finalAway}</span>
            <span className="text-gray-300">{label}</span>
            <span>{homeTeam?.team_name || '—'}: {finalHome}</span>
          </div>
          <div className="flex h-4 rounded-full overflow-hidden bg-gray-700">
            <div
              className="h-full"
              style={{ width: `${away}%`, backgroundColor: awayTeam?.color || '#ef4444' }}
            />
            <div
              className="h-full"
              style={{ width: `${home}%`, backgroundColor: homeTeam?.color || '#3b82f6' }}
            />
          </div>
        </div>
      );
    });

  return (
    <div className="bg-[#1f1f1f] p-6 rounded-xl shadow-lg text-white w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">Team Comparison</h2>

      {/* Announcer view */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4 border-b border-gray-600 pb-1">
          Key Stats (Announcer View)
        </h3>
        {renderStats(announcerStats)}
      </div>

      <button
        className="mb-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
        onClick={() => setShowFull(!showFull)}
      >
        {showFull ? 'Hide Full Stats' : 'Show Full Stats'}
      </button>

      {showFull &&
        fullStatGroups.map((group) => (
          <div key={group.label} className="mb-6">
            <h3 className="text-xl font-semibold mb-4 border-b border-gray-600 pb-1">
              {group.label}
            </h3>
            {renderStats(group.stats)}
          </div>
        ))}
    </div>
  );
}
