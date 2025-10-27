const express = require('express')
const router = express.Router()

const { findPlayerId } = require('../Controllers/playersControllers')
const { findGameId } = require('../Controllers/gamesController')
const { getPlayersStats, getPlayersStatsGame, getTeamStats, getTeamStatsGame } = require('../Controllers/statsControllers')
const { findTeamId } = require('../Controllers/teamsControllers')
const { authenticateToken } = require('../Controllers/authControllers')

router.use('/', authenticateToken)

router.param('player_id', findPlayerId)
router.param('game_id', findGameId)
router.param('team_id', findTeamId)

router.route('/:player_id/:game_id')
  .get(getPlayersStatsGame)

router.route('/:player_id')
  .get(getPlayersStats)

router.route('/teams')
  .get(getTeamStats)

router.route('/teams/:game_id')
  .get(getTeamStatsGame)

module.exports = router