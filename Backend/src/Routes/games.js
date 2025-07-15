const express = require('express')

const router = express.Router()
const { authenticateToken } = require('../Controllers/authControllers')
const { getAllGames, insertGame, findGameId, updateGame } = require('../Controllers/gamesController')
const { getDrives, startDrive, findDriveId, endDrive } = require('../Controllers/drivesControllers')

router.use('/', authenticateToken)

router.route('/')
  .get(getAllGames)
  .post(insertGame)

router.param('id', findGameId)

router.route('/:id')
  .get(async (req, res) => {res.json(req.game)})
  .patch(updateGame)

router.route('/:id/drives')
  .get(getDrives) // Get all drives
  .post(startDrive) // Start drive

router.param('Did', findDriveId)

router.route('/:id/drives/:Did')
  .put(endDrive)

module.exports = router