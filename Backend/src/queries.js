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

const teamQueryTeamsGameHome = `
    SELECT
    t.team_id,
    t.team_name,
    COALESCE(SUM(ps.completions), 0) AS completions,
    COALESCE(SUM(ps.attempts), 0) AS attempts,
    COALESCE(SUM(ps.passing_yards), 0) AS passing_yards,
    COALESCE(SUM(ps.passing_td), 0) AS passing_td,
    COALESCE(SUM(ps.passing_int), 0) AS passing_int,
    COALESCE(SUM(ps.sacked), 0) AS sacked,
    COALESCE(SUM(ps.carries), 0) AS carries,
    COALESCE(SUM(ps.run_yards), 0) AS run_yards,
    COALESCE(SUM(ps.run_td), 0) AS run_td,
    COALESCE(SUM(ps.receptions), 0) AS receptions,
    COALESCE(SUM(ps.targets), 0) AS targets,
    COALESCE(SUM(ps.rec_yards), 0) AS rec_yards,
    COALESCE(SUM(ps.rec_td), 0) AS rec_td,
    COALESCE(SUM(ps.fumbles), 0) AS fumbles,
    COALESCE(SUM(ps.tackles), 0) AS tackles,
    COALESCE(SUM(ps.sacks), 0) AS sacks,
    COALESCE(SUM(ps.interceptions), 0) AS interceptions,
    COALESCE(SUM(ps.punt_attempts), 0) AS punt_attempts,
    COALESCE(SUM(ps.punt_yard), 0) AS punt_yard,
    COALESCE(SUM(ps.punt_long), 0) AS punt_long,
    COALESCE(SUM(ps.return_attempts), 0) AS return_attempts,
    COALESCE(SUM(ps.return_yards), 0) AS return_yards,
    COALESCE(SUM(ps.fg_attempts), 0) AS fg_attempts,
    COALESCE(SUM(ps.fg_makes), 0) AS fg_makes,
    COALESCE(SUM(ps.fg_long), 0) AS fg_long,
    COALESCE(SUM(ps.def_td), 0) AS def_td,
    COALESCE(SUM(ps.extra_made), 0) AS extra_made,
    COALESCE(SUM(ps.extra_missed), 0) AS extra_missed,
    COALESCE(SUM(ps.punt_block), 0) AS punt_block,
    COALESCE(SUM(ps.fg_block), 0) AS fg_block,
    COALESCE(SUM(ps.extra_block), 0) AS extra_block,
    COALESCE(SUM(ps.fumble_recovery), 0) AS fumble_recovery,
    COALESCE(SUM(ps.return_touchdown), 0) AS return_touchdown,
    COALESCE(SUM(ps.onside_attempts), 0) AS onside_attempts,
    COALESCE(SUM(ps.onside_successful), 0) AS onside_successful,
    COALESCE(SUM(ps.kickoff_yards), 0) AS kickoff_yards,
    COALESCE(SUM(ps.kickoff_attempts), 0) AS kickoff_attempts
FROM games g
JOIN teams t 
    ON t.team_id = g.home_team_id
LEFT JOIN players p 
    ON p.team_id = t.team_id
LEFT JOIN player_stats ps 
    ON ps.player_id = p.player_id 
    AND ps.game_id = g.game_id
WHERE g.game_id = $1
GROUP BY t.team_id, t.team_name;
`

const teamQueryTeamsGameAway = `
    SELECT
    t.team_id,
    t.team_name,
    COALESCE(SUM(ps.completions), 0) AS completions,
    COALESCE(SUM(ps.attempts), 0) AS attempts,
    COALESCE(SUM(ps.passing_yards), 0) AS passing_yards,
    COALESCE(SUM(ps.passing_td), 0) AS passing_td,
    COALESCE(SUM(ps.passing_int), 0) AS passing_int,
    COALESCE(SUM(ps.sacked), 0) AS sacked,
    COALESCE(SUM(ps.carries), 0) AS carries,
    COALESCE(SUM(ps.run_yards), 0) AS run_yards,
    COALESCE(SUM(ps.run_td), 0) AS run_td,
    COALESCE(SUM(ps.receptions), 0) AS receptions,
    COALESCE(SUM(ps.targets), 0) AS targets,
    COALESCE(SUM(ps.rec_yards), 0) AS rec_yards,
    COALESCE(SUM(ps.rec_td), 0) AS rec_td,
    COALESCE(SUM(ps.fumbles), 0) AS fumbles,
    COALESCE(SUM(ps.tackles), 0) AS tackles,
    COALESCE(SUM(ps.sacks), 0) AS sacks,
    COALESCE(SUM(ps.interceptions), 0) AS interceptions,
    COALESCE(SUM(ps.punt_attempts), 0) AS punt_attempts,
    COALESCE(SUM(ps.punt_yard), 0) AS punt_yard,
    COALESCE(SUM(ps.punt_long), 0) AS punt_long,
    COALESCE(SUM(ps.return_attempts), 0) AS return_attempts,
    COALESCE(SUM(ps.return_yards), 0) AS return_yards,
    COALESCE(SUM(ps.fg_attempts), 0) AS fg_attempts,
    COALESCE(SUM(ps.fg_makes), 0) AS fg_makes,
    COALESCE(SUM(ps.fg_long), 0) AS fg_long,
    COALESCE(SUM(ps.def_td), 0) AS def_td,
    COALESCE(SUM(ps.extra_made), 0) AS extra_made,
    COALESCE(SUM(ps.extra_missed), 0) AS extra_missed,
    COALESCE(SUM(ps.punt_block), 0) AS punt_block,
    COALESCE(SUM(ps.fg_block), 0) AS fg_block,
    COALESCE(SUM(ps.extra_block), 0) AS extra_block,
    COALESCE(SUM(ps.fumble_recovery), 0) AS fumble_recovery,
    COALESCE(SUM(ps.return_touchdown), 0) AS return_touchdown,
    COALESCE(SUM(ps.onside_attempts), 0) AS onside_attempts,
    COALESCE(SUM(ps.onside_successful), 0) AS onside_successful,
    COALESCE(SUM(ps.kickoff_yards), 0) AS kickoff_yards,
    COALESCE(SUM(ps.kickoff_attempts), 0) AS kickoff_attempts
FROM games g
JOIN teams t 
    ON t.team_id = g.away_team_id
LEFT JOIN players p 
    ON p.team_id = t.team_id
LEFT JOIN player_stats ps 
    ON ps.player_id = p.player_id 
    AND ps.game_id = g.game_id
WHERE g.game_id = $1
GROUP BY t.team_id, t.team_name;
`

module.exports = {teamQueryTeamsGameHome, teamQueryTeamsGameAway, teamQueryTeams}