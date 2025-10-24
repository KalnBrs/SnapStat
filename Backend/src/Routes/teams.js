const express = require('express')

const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');

const upload = multer({ dest: 'uploads/' });


const { authenticateToken } = require('../Controllers/authControllers')
const { getAllTeams, insertTeam, findTeamId, updateTeam, getAllPlayersTeam, clearTeam } = require('../Controllers/teamsControllers')

const router = express.Router()

router.use('/', authenticateToken)

router.get('/', getAllTeams)
router.post('/', insertTeam)

router.param('id', findTeamId)

router.get('/:id/players', getAllPlayersTeam)
router.route('/:id')
  .get((req, res) => { res.json(req.team) })
  .patch(upload.single('player_csv'), updateTeam)
  .delete(clearTeam)

module.exports = router