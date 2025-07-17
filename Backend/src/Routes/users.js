const express = require('express')

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
  .get((req, res) => { res.json(req.user) })
  .patch(updateId)
  .delete(deleteUser)

module.exports = router