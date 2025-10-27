import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";

export default function MomentumChart({ plays, homeTeam, awayTeam }) {
  const momentumData = useMemo(() => {
    if (!plays || !homeTeam || !awayTeam) return [];

    let homeMomentum = 0;
    let awayMomentum = 0;
    const history = [];
    const windowSize = 10;

    return plays.map((play, index) => {
      let delta = play.yards_gained / 10;
      const result = play.result?.toLowerCase() || "";

      if (result.includes("touchdown")) delta += 5;
      if (result.includes("interception") || result.includes("fumble")) delta -= 5;
      if (["pass", "run"].includes(play.play_type?.toLowerCase())) delta += 0.5;

      if (play.team_id === homeTeam.id) homeMomentum += delta;
      else if (play.team_id === awayTeam.id) awayMomentum += delta;

      history.push({ homeMomentum, awayMomentum });
      if (history.length > windowSize) history.shift();

      const avgHome = history.reduce((a, b) => a + b.homeMomentum, 0) / history.length;
      const avgAway = history.reduce((a, b) => a + b.awayMomentum, 0) / history.length;

      return {
        minute: index + 1, // can map to real time later
        momentum: avgHome - avgAway,
      };
    });
  }, [plays, homeTeam, awayTeam]);

  return (
    <div className="bg-[#1e1e1e] p-4 rounded-xl shadow-lg border border-[#333]">
      <h2 className="text-white text-lg font-semibold mb-3 text-center">
        Momentum Flow
      </h2>

      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={momentumData}>
          <defs>
            {/* Gradient for positive (home) */}
            <linearGradient id="positiveMomentum" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={homeTeam.color} stopOpacity={0.6} />
              <stop offset="100%" stopColor={homeTeam.color} stopOpacity={0} />
            </linearGradient>

            {/* Gradient for negative (away) */}
            <linearGradient id="negativeMomentum" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor={awayTeam.color} stopOpacity={0.6} />
              <stop offset="100%" stopColor={awayTeam.color} stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
          <XAxis
            dataKey="minute"
            stroke="#888"
            tick={{ fill: "#ccc", fontSize: 12 }}
            tickLine={false}
          />
          <YAxis
            stroke="#888"
            tick={{ fill: "#ccc", fontSize: 12 }}
            tickLine={false}
            domain={["auto", "auto"]}
            label={{
              value: "Momentum",
              angle: -90,
              position: "insideLeft",
              fill: "#aaa",
              fontSize: 12,
            }}
          />
          <Tooltip
            contentStyle={{ backgroundColor: "#222", border: "none", color: "#fff" }}
            formatter={(value) => [`${value.toFixed(2)}`, "Momentum"]}
          />
          <ReferenceLine y={0} stroke="#666" strokeWidth={1} />

          {/* Single line, fills above/below */}
          <Area
            type="monotone"
            dataKey="momentum"
            stroke="#fff"
            fillOpacity={1}
            fill="url(#positiveMomentum)"
            isAnimationActive={false}
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="momentum"
            stroke="#fff"
            fillOpacity={1}
            fill="url(#negativeMomentum)"
            isAnimationActive={false}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="flex justify-between text-sm text-gray-400 mt-2">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: awayTeam.color }}
          />
          <span>{awayTeam.abbreviation}</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: homeTeam.color }}
          />
          <span>{homeTeam.abbreviation}</span>
        </div>
      </div>
    </div>
  );
}
