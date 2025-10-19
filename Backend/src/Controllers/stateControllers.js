const pool = require('../Config/db')

const getState = (req, res) => {
  const { quarter, down, distance, ball_on_yard, possession_team_id, current_drive_id } = req.game
  res.json({ quarter: quarter, down: down, distance: distance, ball_on_yard: ball_on_yard, possession_team_id: possession_team_id, current_drive_id: current_drive_id })
}

const updateState = async (req, res) => {
  const allowedColumns = ['quarter', 'down', 'distance', 'ball_on_yard', 'possession_team_id', 'current_drive_id', 'home_timeouts', 'away_timeouts', "home_score", "away_score"]
  const setClauses = []
  const values = []
  let index = 1

  const body = req.body
  for (let key in body) {
    if (!allowedColumns.includes(key)) throw new Error('Column Not allowed')
    setClauses.push(`${key} = $${index}`)
    values.push(body[key])
    index++
  }
  if (setClauses.length === 0) return res.sendStatus(406)
  values.push(req.game.game_id)
  const query = `UPDATE games SET ${setClauses.join(', ')} WHERE game_id = $${index} RETURNING *`
  try {
    const result = await pool.query(query, values)
    res.json(result.rows[0])
  } catch (err) {
    res.sendStatus(500)
  }
}

const clearState = async (req, res) => {
  try {
    const result = await pool.query('UPDATE games SET quarter = null, down = null, distance = null, ball_on_yard = null, possession_team_id = null, current_drive_id = null WHERE game_id = $1 RETURNING *;', [req.game.game_id])
    if (result.rows.length === 0) return res.status(404).send('Game Not Found')
    res.json(result.rows[0])
  } catch (err) {
    res.sendStatus(500)
  }
}

module.exports = { getState, updateState, clearState }