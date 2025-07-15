const express = require('express')

const { authenticateToken } = require('../Controllers/authControllers')
const { getAllTeams, insertTeam, findTeamId, updateTeam, getAllPlayersTeam } = require('../Controllers/teamsControllers')

const router = express.Router()

router.use('/', authenticateToken)

router.get('/', getAllTeams)
router.post('/', insertTeam)

router.param('id', findTeamId)

router.get('/:id/players', getAllPlayersTeam)
router.route('/:id')
  .get((req, res) => { res.json(req.team) })
  .patch(updateTeam)

module.exports = router