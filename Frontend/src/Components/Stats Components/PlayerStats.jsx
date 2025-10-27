import { useState, useEffect, useMemo } from "react";
import { getPlayerStats } from "../../Scripts/teamViewApi";

export default function PlayerStats({ players, gameId, show }) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [playerStats, setPlayerStats] = useState({}); // { player_id: stats }

  useEffect(() => {
    players.forEach(async (player) => {
      if (!playerStats[player.player_id]) {
        try {
          const stats = await getPlayerStats(player.player_id, gameId);
          setPlayerStats((prev) => ({ ...prev, [player.player_id]: stats }));
        } catch (err) {
          console.error(`Error fetching stats for ${player.name}`, err);
        }
      }
    });
  }, [players, gameId]);

  const filteredPlayers = useMemo(() => {
    let data = players
      .map((p) => ({
        ...p,
        stats: playerStats[p.player_id] || {},
      }))
      .filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.position.toLowerCase().includes(search.toLowerCase())
      );

    if (sortKey) {
      data.sort((a, b) => {
        let valA = a.stats[sortKey] ?? a[sortKey] ?? 0;
        let valB = b.stats[sortKey] ?? b[sortKey] ?? 0;
        if (typeof valA === "string" || typeof valB === "string") {
          valA = String(valA) ? String(valA) : '';
          valB = String(valB) ? String(valB) : '';
          return sortOrder === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        return sortOrder === "asc" ? valA - valB : valB - valA;
      });
    }

    return data;
  }, [players, playerStats, search, sortKey, sortOrder]);

  const handleSort = (key) => {
    if (sortKey === key) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const columns = [
    { label: "Player", key: "name" },
    { label: "#", key: "number" },
    { label: "Pos", key: "position" },
    { label: "Ht", key: "height" },
    { label: "Wt", key: "weight" },
    { label: "Yr", key: "year" },

    // Passing
    { label: "Pass C/A", key: "pass_comp_att" },
    { label: "Pass Yds", key: "passing_yards" },
    { label: "TD / INT / Sck", key: "pass_summary" },

    // Rushing
    { label: "Carries", key: "carries" },
    { label: "Rush Yds", key: "run_yards" },
    { label: "Rush TD", key: "run_td" },

    // Receiving
    { label: "Rec", key: "receptions" },
    { label: "Rec Yds", key: "rec_yards" },
    { label: "Rec TD", key: "rec_td" },

    // Defense
    { label: "Tackles", key: "tackles" },
    { label: "Sacks", key: "sacks" },
    { label: "INT", key: "interceptions" },
    { label: "Def TD", key: "def_td" },

    // Special Teams
    { label: "FG (M/A)", key: "fg_summary" },
    { label: "Punt Avg", key: "punt_avg" },
    { label: "Punt Long", key: "punt_long" },
    { label: "Ret Yds", key: "return_yards" },
    { label: "Ret TD", key: "return_touchdown" },
  ];

  const renderStatValue = (p, col) => {
    const s = p.stats;
    switch (col.key) {
      case "pass_comp_att":
        return `${s.completions ?? 0}/${s.attempts ?? 0}`;
      case "pass_summary":
        return `${s.passing_td ?? 0}/${s.passing_int ?? 0}/${s.sacked ?? 0}`;
      case "fg_summary":
        return `${s.fg_makes ?? 0}/${s.fg_attempts ?? 0}`;
      case "punt_avg":
        const avg = s.punt_attempts ? (s.punt_yard / s.punt_attempts).toFixed(1) : 0;
        return avg;
      default:
        return s[col.key] ?? p[col.key] ?? "0";
    }
  };

  if (!show) return null

  return (
    <div className="overflow-x-auto">
      <div className="mb-2">
        <input
          type="text"
          placeholder="Search Player..."
          className="p-2 rounded bg-gray-700 text-white w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className="min-w-full text-sm text-left border-collapse">
        <thead>
          <tr className="bg-[#383838] text-gray-200">
            {columns.map((col) => (
              <th key={col.key} className="p-2 cursor-pointer text-xs" onClick={() => handleSort(col.key)}>
                {col.label}
                {sortKey === col.key ? (sortOrder === "asc" ? " ↑" : " ↓") : ""}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredPlayers.map((p) => (
            <tr key={p.player_id} className="hover:bg-[#3a3a3a] transition">
              {columns.map((col) => (
                <td key={col.key} className="p-2">
                  {renderStatValue(p, col)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
