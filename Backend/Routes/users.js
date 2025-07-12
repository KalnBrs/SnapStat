const express = require('express')
const pool = require('../Database/db')
const bcrypt = require('bcrypt')


const { authenticateToken } = require('../Controllers/authControllers')
const { findId, updateId, deleteUser, getUsers } = require('../Controllers/usersControllers')

const router = express.Router()
router.use(express.json())
router.use('/', authenticateToken)

// Get all users
router.get('/', getUsers)

// Get a specific user
router.param('id', findId)

router.route('/:id')
  .get((req, res) => {res.send(req.user)})
  .patch(updateId)
  .delete(deleteUser)

module.exports = router