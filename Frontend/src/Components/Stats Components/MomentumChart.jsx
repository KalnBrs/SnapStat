import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

export default function MomentumChart({ plays, homeTeam, awayTeam }) {
  const data = useMemo(() => {
    if (!plays?.length || !homeTeam || !awayTeam) return [];
    return calculateMomentumFromPlays(plays, homeTeam.team_id, awayTeam.team_id);
  }, [plays, homeTeam, awayTeam]);

  return (
    <div className="bg-[#2e2e2e] p-4 rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold mb-4 border-b border-gray-600 pb-2">
        Momentum Tracker
      </h2>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <XAxis dataKey="name" hide />
          <YAxis domain={[-100, 100]} hide />
          <Tooltip
            contentStyle={{ backgroundColor: "#333", border: "none" }}
            formatter={(value) => [`${value.toFixed(1)}`, "Momentum"]}
          />
          <ReferenceLine y={0} stroke="#666" />
          <Line
            type="monotone"
            dataKey="momentum"
            stroke="#22c55e"
            dot={false}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="flex justify-between mt-2 text-sm text-gray-400">
        <span className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: homeTeam?.color || "#22c55e" }}></div>
          {homeTeam?.abbreviation || "HOME"}
        </span>
        <span className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: awayTeam?.color || "#ef4444" }}></div>
          {awayTeam?.abbreviation || "AWAY"}
        </span>
      </div>
    </div>
  );
}

// helper (same file or separate utils/stats.js)
function calculateMomentumFromPlays(plays, homeTeamId, awayTeamId) {
  let momentum = 0;
  const data = [];

  plays.forEach((play, i) => {
    let impact = 0;
    if (play.yards_gained >= 20) impact += 5;
    else if (play.yards_gained >= 10) impact += 3;
    else if (play.yards_gained > 0) impact += 1;
    else if (play.yards_gained < 0) impact -= 3;

    switch (play.result) {
      case "Touchdown": impact += 10; break;
      case "Field Goal Made": impact += 5; break;
      case "Missed FG": impact -= 4; break;
      case "Interception":
      case "Fumble": impact -= 8; break;
      case "Sack": impact -= 4; break;
      case "Incomplete": impact -= 1; break;
    }

    if (play.team_id === homeTeamId) momentum += impact;
    else momentum -= impact;

    momentum = Math.max(-100, Math.min(100, momentum * 0.97));

    data.push({
      name: `Play ${i + 1}`,
      momentum,
    });
  });

  return data;
}
