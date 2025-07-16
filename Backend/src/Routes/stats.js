const express = require('express')
const router = express.Router()

const { findPlayerId } = require('../Controllers/playersControllers')
const { findGameId } = require('../Controllers/gamesController')
const { getPlayersStats, getPlayersStatsGame, getTeamStats, getTeamStatsGame } = require('../Controllers/statsControllers')
const { findTeamId } = require('../Controllers/teamsControllers')

router.use('/', authenticateToken)

router.param('player_id', findPlayerId)
router.param('game_id', findGameId)
router.param('team_id', findTeamId)

router.route('/:player_id/stats')
  .get(getPlayersStats)

router.route('/:player_id/:game_id/stats')
  .get(getPlayersStatsGame)

router.route('/teams')
  .get(getTeamStats)

router.route('/teams/:game_id')
  .get(getTeamStatsGame)

module.exports = router