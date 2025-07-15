const express = require('express')

const { getAllPlayers, insertPlayer, findPlayerId, updatePlayer } = require('../Controllers/playersControllers')
const { authenticateToken } = require('../Controllers/authControllers')

const router = express.Router()

router.use('/', authenticateToken)

router.get('/', getAllPlayers)
router.post('/', insertPlayer)

router.param('id', findPlayerId)

router.route('/:id')
  .get((req, res) => { res.json(req.player) })
  .patch(updatePlayer)

module.exports = router