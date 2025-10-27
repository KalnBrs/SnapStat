import React from "react";

export default function QuickViewDashboard({ homeTeam, awayTeam, game }) {
  if (!homeTeam || !awayTeam || !game) return null;

  // Expected: game.home_timeouts and game.away_timeouts (0–3)
  const renderTimeouts = (count, color) => {
    const max = 3;
    return (
      <div className="flex gap-1 mt-1">
        {[...Array(max)].map((_, i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-sm border border-gray-500"
            style={{
              backgroundColor: i < count ? color : "transparent",
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex items-center justify-center bg-[#2c2c2c] p-4 rounded-lg shadow-md">
      <div className="flex items-center gap-3 mr-auto">
        {/* Away Team Color + Logo */}
        <div
          className="w-5 h-5 rounded-xl"
          style={{ backgroundColor: awayTeam?.color || "#888" }}
        />

        <div className="flex flex-col items-center">
          {awayTeam?.logo_url ? (
            <img
              src={awayTeam.logo_url}
              alt={awayTeam.name}
              className="w-12 h-12 mx-2 rounded-full"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-600 text-3xl font-extrabold flex items-center justify-center">
              ?
            </div>
          )}
          <p className="text-white font-bold text-sm mt-1">
            {awayTeam?.abbreviation}
          </p>
          {/* Away timeouts bar */}
          {renderTimeouts(game.away_timeouts ?? 0, awayTeam.color || "#ccc")}
        </div>

        {/* Scores */}
        <p className="text-white font-semibold text-lg ml-2">
          {game?.away_score}
        </p>
        <span className="mx-2 text-white font-bold">vs</span>
        <p className="text-white font-semibold text-lg">{game?.home_score}</p>

        {/* Home Team Logo + Color */}
        <div className="flex flex-col items-center ml-2">
          {homeTeam?.logo_url ? (
            <img
              src={homeTeam.logo_url}
              alt={homeTeam.name}
              className="w-12 h-12 mx-2 rounded-full"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-600 text-3xl font-extrabold flex items-center justify-center">
              ?
            </div>
          )}
          <p className="text-white font-bold text-sm mt-1">
            {homeTeam?.abbreviation}
          </p>
          {/* Home timeouts bar */}
          {renderTimeouts(game.home_timeouts ?? 0, homeTeam.color || "#ccc")}
        </div>

        <div
          className="w-5 h-5 rounded-xl"
          style={{ backgroundColor: homeTeam?.color || "#888" }}
        />
      </div>
    </div>
  );
}
