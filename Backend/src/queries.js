const teamQueryTeams = `
  SELECT
  t.team_id,
  t.team_name,
  SUM(ps.completions) AS completions,
  SUM(ps.attempts) AS attempts,
  SUM(ps.passing_yards) AS passing_yards,
  SUM(ps.passing_td) AS passing_td,
  SUM(ps.passing_int) AS passing_int,
  SUM(ps.sacked) AS sacked,
  SUM(ps.carries) AS carries,
  SUM(ps.run_yards) AS run_yards,
  SUM(ps.run_td) AS run_td,
  SUM(ps.receptions) AS receptions,
  SUM(ps.targets) AS targets,
  SUM(ps.rec_yards) AS rec_yards,
  SUM(ps.rec_td) AS rec_td,
  SUM(ps.fumbles) AS fumbles,
  SUM(ps.tackles) AS tackles,
  SUM(ps.sacks) AS sacks,
  SUM(ps.interceptions) AS interceptions,
  SUM(ps.punt_attempts) AS punt_attempts,
  SUM(ps.punt_yard) AS punt_yard,
  SUM(ps.punt_long) AS punt_long,
  SUM(ps.return_attempts) AS return_attempts,
  SUM(ps.return_yards) AS return_yards,
  SUM(ps.fg_attempts) AS fg_attempts,
  SUM(ps.fg_makes) AS fg_makes,
  SUM(ps.fg_long) AS fg_long,
  SUM(ps.def_td) AS def_td,
  SUM(ps.extra_made) AS extra_made,
  SUM(ps.extra_missed) AS extra_missed,
  SUM(ps.punt_block) AS punt_block,
  SUM(ps.fg_block) AS fg_block,
  SUM(ps.extra_block) AS extra_block,
  SUM(ps.fumble_recovery) AS fumble_recovery,
  SUM(ps.return_touchdown) AS return_touchdown,
  SUM(ps.onside_attempts) AS onside_attempts,
  SUM(ps.onside_successful) AS onside_successful,
  SUM(ps.kickoff_yards) AS kickoff_yards,
  SUM(ps.kickoff_attempts) AS kickoff_attempts
FROM player_stats ps
JOIN players p ON p.player_id = ps.player_id
JOIN teams t ON t.team_id = p.team_id
WHERE ps.game_id = $1
GROUP BY t.team_id, t.team_name;
`

const teamQueryTeamsGame = `
    SELECT
  t.team_id,
  t.team_name,
  SUM(ps.completions) AS completions,
  SUM(ps.attempts) AS attempts,
  SUM(ps.passing_yards) AS passing_yards,
  SUM(ps.passing_td) AS passing_td,
  SUM(ps.passing_int) AS passing_int,
  SUM(ps.sacked) AS sacked,
  SUM(ps.carries) AS carries,
  SUM(ps.run_yards) AS run_yards,
  SUM(ps.run_td) AS run_td,
  SUM(ps.receptions) AS receptions,
  SUM(ps.targets) AS targets,
  SUM(ps.rec_yards) AS rec_yards,
  SUM(ps.rec_td) AS rec_td,
  SUM(ps.fumbles) AS fumbles,
  SUM(ps.tackles) AS tackles,
  SUM(ps.sacks) AS sacks,
  SUM(ps.interceptions) AS interceptions,
  SUM(ps.punt_attempts) AS punt_attempts,
  SUM(ps.punt_yard) AS punt_yard,
  SUM(ps.punt_long) AS punt_long,
  SUM(ps.return_attempts) AS return_attempts,
  SUM(ps.return_yards) AS return_yards,
  SUM(ps.fg_attempts) AS fg_attempts,
  SUM(ps.fg_makes) AS fg_makes,
  SUM(ps.fg_long) AS fg_long,
  SUM(ps.def_td) AS def_td,
  SUM(ps.extra_made) AS extra_made,
  SUM(ps.extra_missed) AS extra_missed,
  SUM(ps.punt_block) AS punt_block,
  SUM(ps.fg_block) AS fg_block,
  SUM(ps.extra_block) AS extra_block,
  SUM(ps.fumble_recovery) AS fumble_recovery,
  SUM(ps.return_touchdown) AS return_touchdown,
  SUM(ps.onside_attempts) AS onside_attempts,
  SUM(ps.onside_successful) AS onside_successful,
  SUM(ps.kickoff_yards) AS kickoff_yards,
  SUM(ps.kickoff_attempts) AS kickoff_attempts
FROM player_stats ps
JOIN players p ON p.player_id = ps.player_id
JOIN teams t ON t.team_id = p.team_id
WHERE ps.game_id = $1
GROUP BY t.team_id, t.team_name;
`

module.exports = {teamQueryTeamsGame, teamQueryTeams}