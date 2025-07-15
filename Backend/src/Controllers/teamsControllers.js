const pool = require('../Config/db')

const findTeamId = async (req, res, next, value) => {
  try {
    const result = await pool.query('SELECT * FROM teams WHERE team_id = $1', [value])
    if (result.rows.length === 0) return res.sendStatus(404)
    req.team = result.rows[0]
    next()
  } catch (err) {
    res.status(500).send(err.message)
  }
}

const getAllPlayersTeam = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM players WHERE team_id = $1;', [req.team.team_id])
    if (result.rows.length === 0) return res.status(404).send('No Players')
    res.json(result.rows)
  } catch (err) {
    res.sendStatus(500)
  }
}

const getAllTeams = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM teams;')
    if (result.rows.length === 0) return res.status(404).send('No Teams')
    res.json(result.rows)
  } catch (err) {
    res.sendStatus(500)
  }
}

const updateTeam = async (req, res) => {
  const allowedColumns = ['team_name', 'abbreviation', 'color', 'logo_url']
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
  values.push(req.team.team_id)
  const query = `UPDATE teams SET ${setClauses.join(', ')} WHERE team_id = $${index} RETURNING team_id, team_name, abbreviation, color, logo_url`
  try {
    const result = await pool.query(query, values)
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).send(err.message)
  }
}

const insertTeam = async (req, res) => {
  const allowedColumns = ['team_name', 'abbreviation', 'color', 'logo_url']
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
  const query = `INSERT INTO teams (${insertClauses.join(', ')}) VALUES(${values.join(', ')}) RETURNING *`
  try {
    const result = await pool.query(query, placeholders)
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).send(err.message)
  }
}

module.exports = { getAllTeams, insertTeam, findTeamId, updateTeam, getAllPlayersTeam }