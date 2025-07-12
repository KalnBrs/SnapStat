const express = require('express');
const jwt = require('jsonwebtoken')
const path = require('path')
const pool = require('../Database/db')
const bcrypt = require('bcrypt')
const redisClient = require('../Database/redisClient')

const { authenticateToken, login, logout, register, refresh, getMe } = require('../Controllers/authControllers')

const router = express.Router();
router.use(express.json())

router.get('/register', (req, res) => {
  res.send(req.body.username)
})

router.post('/login', login)
router.post('/register', register)
router.post('/logout', logout)
router.post('/refresh', refresh)
router.get('/me', authenticateToken, getMe)

module.exports = router;