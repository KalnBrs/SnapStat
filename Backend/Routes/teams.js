const express = require('express')

const { authenticateToken } = require('../Controllers/authControllers')
const { getAllTeams, insertTeam, findTeamId, updateTeam } = require('../Controllers/teamsControllers')

const router = express.Router()

router.get('/', authenticateToken, getAllTeams)
router.post('/', authenticateToken, insertTeam)

router.param('id', findTeamId)

router.route('/:id')
  .get((req, res) => { res.json(req.team) })
  .patch(authenticateToken, updateTeam)

module.exports = router