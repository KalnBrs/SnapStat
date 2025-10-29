const pool = require('../Config/db')

const allowedColumns = ['home_team_id', 'away_team_id', 'home_score', 'away_score', 'home_timeouts', 'away_timeouts', 'quarter', 'down', 'distance', 'ball_on_yard', 'possession_team_id', 'current_drive_id', 'date', 'finished']

const findGameId = async (req, res, next, value) => {
  try {
    const result = await pool.query('SELECT * FROM games WHERE game_id = $1', [value])
    if (result.rows.length === 0) return res.sendStatus(404)
    req.game = result.rows[0]
    next()
  } catch (err) {
    console.log(err)
    res.sendStatus(500)
  }
}

const updateGame = async (req, res) => {
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

const getAllGames = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM games;')
    if (result.rows.length === 0) return res.status(404).send(' No Games ')
    res.json(result.rows[0])
  } catch {
    res.sendStatus(500)
  }
}

const insertGame = async (req, res) => {
  const insertClauses = []
  const values = []
  const placeholders = []
  let index = 1

  const body = req.body
  for (let key in body) {
    if (!allowedColumns.includes(key)) throw new Error('Column Not allowed')
    insertClauses.push(`${key}`)
    values.push(`$${index}`)
    placeholders.push(body[key])
    index++
  }
  if (insertClauses.length === 0) return res.sendStatus(406)
  const query = `INSERT INTO games (${insertClauses.join(', ')}) VALUES(${values.join(', ')}) RETURNING *;`

  try {
    const result = await pool.query(query, placeholders)
    await pool.query(`INSERT INTO gameplayers (game_id, user_id) VALUES(${result.rows[0].game_id}, '${req.user.user_id}') RETURNING *`)
    res.json(result.rows[0])
  } catch (err) {
    console.log(err.message)
    res.sendStatus(500)
  }
}

module.exports = { getAllGames, insertGame, updateGame, findGameId }