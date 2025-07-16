const pool = require('../Config/db')
const {teamQueryTeams, teamQueryTeamsGame} = require('../queries')


const getPlayersStats = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM player_stats WHERE player_id = $1', [req.player.player_id])
    if (result.rows.length === 0) return res.sendStatus(404)
    res.json(result.rows[0])
  } catch (err) {
    res.sendStatus(500)
  }
}

const getPlayersStatsGame = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM player_stats WHERE player_id = $1 AND game_id = $2', [req.player.player_id, req.game.game_id])
    if (result.rows.length === 0) return res.sendStatus(404)
    res.json(result.rows[0])
  } catch (err) {
    res.sendStatus(500)
  }
}

const getTeamStats = async (req, res) => {
  try {
    const result = await pool.query(teamQueryTeams, [req.game.game_id])
    if (result.rows.length === 0) return res.sendStatus(404)
    res.json(result.rows[0])
  } catch (err) {
    res.sendStatus(500)
  }
}

const getTeamStatsGame = async (req, res) => {
  try {
    const result = await pool.query(teamQueryTeamsGame, [req.game.game_id])
    if (result.rows.length === 0) return res.sendStatus(404)
    res.json(result.rows[0])
  } catch (err) {
    res.sendStatus(500)
  }
}

module.exports = { getPlayersStats, getPlayersStatsGame, getTeamStatsGame, getTeamStats}