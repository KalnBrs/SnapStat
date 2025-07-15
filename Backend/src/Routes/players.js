const express = require('express')

const { getAllPlayers, insertPlayer, findPlayerId, updatePlayer } = require('../Controllers/playersControllers')
const { authenticateToken } = require('../Controllers/authControllers')

const router = express.Router()

router.get('/', authenticateToken, getAllPlayers)
router.post('/', authenticateToken, insertPlayer)

router.param('id', findPlayerId)

router.route('/:id')
  .get(authenticateToken, (req, res) => { res.json(req.player) })
  .patch(authenticateToken, updatePlayer)

module.exports = router