const express = require('express')
const pool = require('../Database/db')
const bcrypt = require('bcrypt')


const { authenticateToken } = require('../Controllers/authControllers')
const { findId, updateId, deleteUser } = require('../Controllers/usersControllers')

const router = express.Router()
router.use(express.json())
router.use('/', authenticateToken)

// Get all users
router.get('/', authenticateToken, async (req, res) => {
  const role = req.user.role
  if (role !== 'admin') return res.sendStatus(401)
  const users = await pool.query('SELECT * FROM users')
  res.json(users.rows);
})

// Get a specific user
router.param('id', findId)

router.route('/:id')
  .get((req, res) => {res.send(req.user)})
  .patch(updateId)
  .delete(deleteUser)

module.exports = router