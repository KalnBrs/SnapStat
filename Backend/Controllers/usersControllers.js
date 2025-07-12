const pool = require('../Database/db')
const bcrypt = require('bcrypt')

const findId = async (req, res, next, value) => {
  try {
    const result = await pool.query('SELECT user_id, username, email, role FROM users WHERE user_id = $1', [value])
    if (result.rows.length === 0) return res.sendStatus(404)
    req.user = result.rows[0]
    next()
  } catch (err) {
    res.sendStatus(500)
  }
} 

const updateId = async (req, res) => {
  const allowedColumns = ["username", "email", "password", "role"]
  const setClauses = []
  const values = []
  let index = 1

  const updates = req.body.updates
  for (let key in updates){
    if (!allowedColumns.includes(key)) throw new Error(`Invalid column: ${key}`)
    setClauses.push(`${key} = $${index}`)
    values.push(updates[key])
    index++
  }
  if (setClauses.length === 0) return res.sendStatus(406)
  values.push(req.user.user_id)
  const query = `UPDATE users SET ${setClauses.join(', ')} WHERE user_id = $${index} RETURNING user_id, username, email, role`

  try{
    const result = await pool.query(query, values)
    res.json(result.rows[0])
  } catch (err) {
    res.status(500).send
  }
}

const deleteUser = async (req, res) => {
  try {
    let password = await pool.query('SELECT password FROM users WHERE user_id = $1', [req.user.user_id])
    password = password.rows[0]
    if (await bcrypt.compare(req.body.password, password.password)) {
      const deletedUser = await pool.query('DELETE FROM users WHERE user_id = $1 RETURNING username, email, role', [req.user.user_id])
      res.json(deletedUser.rows[0])
    }
  } catch (err) {
    res.status(500).send(err.message)
  }
}

const getUsers = async (req, res) => {
  const role = req.user.role
  if (role !== 'admin') return res.sendStatus(401)
  const users = await pool.query('SELECT * FROM users')
  res.json(users.rows);
}

module.exports = { findId, updateId, deleteUser, getUsers }