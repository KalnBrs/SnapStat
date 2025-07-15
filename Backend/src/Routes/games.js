const express = require('express')

const router = express.Router()
const { authenticateToken } = require('../Controllers/authControllers')
const { getAllGames, insertGame, findGameId, updateGame } = require('../Controllers/gamesController')

router.use('/', authenticateToken)

router.route('/')
  .get(getAllGames)
  .post(insertGame)

router.param('id', findGameId)
router.route('/:id')
  .get(async (req, res) => {res.json(req.game)})
  .patch(updateGame)

module.exports = router