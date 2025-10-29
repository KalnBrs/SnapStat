const jwt = require('jsonwebtoken')
const pool = require('../Config/db')
const bcrypt = require('bcrypt')
const redisClient = require('../Config/redisClient')

const findPlayerId = async (req, res, next, value) => {
  try {

    const result = await pool.query('SELECT * FROM players WHERE player_id = $1', [value])
    if (result.rows.length === 0) return res.sendStatus(404)
    req.player = result.rows[0]
    next()
  } catch (err) {
    console.log(err)
    res.sendStatus(500)
  }
}

const getAllPlayers = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM players')
    if (result.rows.length === 0) return res.status(404).send('No Players Found')
    res.json(result.rows)
  } catch (err) {
    res.sendStatus(500)
  }
}

const insertPlayer = async (req, res) => {
  const allowedColumns = ['name', 'number', 'team_id', 'year', 'position', 'height', 'weight']
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
  const query = `INSERT INTO players (${insertClauses.join(', ')}) VALUES(${values.join(', ')}) RETURNING *`
  try {
    const result = await pool.query(query, placeholders)
    res.json(result.rows[0])
  } catch (err) {
    res.sendStatus(500)
  }
}

const updatePlayer = async (req, res) => {
  const allowedColumns = ['name', 'number', 'team_id']
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
  values.push(req.player.player_id)
  const query = `UPDATE players SET ${setClauses.join(', ')} WHERE player_id = $${index} RETURNING player_id, name, number, team_id`
  try {
    const result = await pool.query(query, values)
    res.json(result.rows[0])
  } catch (err) {
    res.sendStatus(500)
  }
}

module.exports = { getAllPlayers, insertPlayer, findPlayerId, updatePlayer }