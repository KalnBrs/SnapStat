const express = require('express')

const router = express.Router()
const { authenticateToken } = require('../Controllers/authControllers')
const { getAllGames, insertGame, findGameId, updateGame } = require('../Controllers/gamesController')
const { getDrives, startDrive, findDriveId, endDrive } = require('../Controllers/drivesControllers')
const { getAllPlays, submitPlay } = require('../Controllers/playsControllers')
const { getState, updateState, clearState } = require('../Controllers/stateControllers')


router.use('/', authenticateToken)

router.route('/')
  .get(getAllGames)
  .post(insertGame)

router.param('id', findGameId)

router.route('/:id')
  .get(async (req, res) => {res.json(req.game)})
  .patch(updateGame)

router.route('/:id/state')
  .get(getState)
  .post(updateState) // Update State
  .delete(clearState) // Clear state on game finish

router.route('/:id/drives')
  .get(getDrives) // Get all drives
  .post(startDrive) // Start drive

router.param('Did', findDriveId)

router.route('/:id/drives/:Did')
  .get(async (req, res) => { res.json(req.drive)})
  .put(endDrive) // End a drive

router.route('/:id/plays')
  .get(getAllPlays) // Get all plays 
  .post(submitPlay) // Submit a play

module.exports = router