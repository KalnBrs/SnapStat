import { motion } from "framer-motion";


export default function MomentumBar({ plays, homeTeam, awayTeam }) {
  if (!plays?.length || !homeTeam || !awayTeam) return null;

  const momentumScore = calculateMomentumFromPlays(
    plays,
    homeTeam.team_id,
    awayTeam.team_id
  );

  const maxMomentum = 100;

  // Convert to 0–100% scale
  const normalized = ((momentumScore + maxMomentum) / (2 * maxMomentum)) * 100;
  const homePercent = Math.round(normalized);
  const awayPercent = 100 - homePercent;

  return (
    <div className="flex flex-col items-center w-full my-6">
      {/* Bar Container */}
      <div className="relative w-3/4 h-10 bg-gray-800 rounded-full overflow-hidden shadow-lg border border-gray-700">
        {/* Away side (left) */}
        <motion.div
          className="absolute left-0 top-0 h-full"
          style={{ backgroundColor: awayTeam.color }}
          animate={{ width: `${awayPercent}%` }}
          transition={{ type: "spring", stiffness: 80, damping: 15 }}
        />
        {/* Home side (right) */}
        <motion.div
          className="absolute right-0 top-0 h-full"
          style={{ backgroundColor: homeTeam.color }}
          animate={{ width: `${homePercent}%` }}
          transition={{ type: "spring", stiffness: 80, damping: 15 }}
        />

        {/* Center Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-gray-500 opacity-70" />

        {/* Percentage Text Overlay */}
        <div className="absolute inset-0 flex justify-between px-4 items-center text-sm font-semibold">
          <span className="text-white drop-shadow-md">{awayPercent}%</span>
          <span className="text-white drop-shadow-md">{homePercent}%</span>
        </div>
      </div>

      {/* Labels */}
      <div className="flex justify-between w-3/4 mt-3 text-gray-300 text-sm font-semibold">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: awayTeam.color }}
          />
          {awayTeam.abbreviation}
        </div>

        <p className="text-white">
          {momentumScore > 10
            ? `${homeTeam.abbreviation} Momentum`
            : momentumScore < -10
            ? `${awayTeam.abbreviation} Momentum`
            : "Even Game"}
        </p>

        <div className="flex items-center gap-2">
          {homeTeam.abbreviation}
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: homeTeam.color }}
          />
        </div>
      </div>
    </div>
  );
}

// Helper Function
function calculateMomentumFromPlays(plays, homeTeamId, awayTeamId) {
  let score = 0;
  const maxMomentum = 100;

  plays.forEach(play => {
    let delta = 0;
    const result = play.result?.trim();
    const yards = (play.end_yard - play.start_yard) || 0;

    // ✅ Yardage always contributes slightly
    delta += yards * 0.25;

    switch (result) {
      // --- Big scoring plays ---
      case "Offensive Touchdown":
      case "Touchdown":
      case "On-side Touchdown":
        delta += 20;
        break;

      case "Pick-Six":
      case "Scoop and Score":
      case "Blocked punt TD":
      case "Blocked kick TD":
        delta += 25; // big defensive/special teams momentum
        break;

      // --- Conversions ---
      case "2pt_made":
      case "Extra Point Made":
        delta += 4;
        break;
      case "2pt_missed":
      case "Extra Point Missed":
      case "Extra Point Blocked":
      case "Blocked extra TD":
        delta -= 4;
        break;

      // --- Field Goals ---
      case "Field Goal Made":
        delta += 10;
        break;
      case "Field Goal Missed":
      case "Field Goal Blocked":
        delta -= 8;
        break;

      // --- Safeties ---
      case "Safety":
      case "Def Safety":
        delta += 15;
        break;

      // --- Turnovers ---
      case "Interception":
        delta -= 18;
        break;
      case "Fumble":
      case "Fumble Lost":
        delta -= 15;
        break;
      case "Offensive Recovery":
        delta += 6;
        break;

      // --- Kick/Punt Results ---
      case "Kick Return":
      case "Punt Return":
        delta += 2;
        break;
      case "Fair Catch":
      case "Touchback":
        delta += 0;
        break;
      case "Punt Blocked":
        delta -= 10;
        break;
      case "On-side":
        delta += 6;
        break;

      // --- Routine Offensive Plays ---
      case "Completion":
        delta += 3;
        break;
      case "Incomplete":
        delta -= 1;
        break;
      case "Tackle":
        delta -= 2;
        break;

      default:
        // no momentum swing for unrecognized results
        break;
    }

    // Assign delta to home or away
    if (play.team_id === homeTeamId) score += delta;
    else if (play.team_id === awayTeamId) score -= delta;
  });

  // Clamp between -maxMomentum and +maxMomentum
  return Math.max(-maxMomentum, Math.min(score, maxMomentum));
}

