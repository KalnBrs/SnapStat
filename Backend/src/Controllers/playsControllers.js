const pool = require('../Config/db')
const { applyStatRules } = require('../statRules')

const points = {
  "Touchdown": 6,
  "Pick-Six": 6,
  "Scoop and score": 6,
  "Blocked punt TD": 6,
  "Blocked kick TD": 6,
  "Field Goal Made": 3,
  "Safety": 2,
  "Def Safety": 2,
  "2pt_made": 2,
  "Blocked extra TD": 2,
  "Extra Point Made": 1
}

const defTurnovers = ["Interception", "Fumble", "Fumble",]

const getAllPlays = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM plays WHERE game_id = $1;', [req.game.game_id])
    if (result.rows.length === 0) return res.status(404).send('No Plays')
    res.json(result.rows)
  } catch (err) {
    res.sendStatus(500)
  }
}

const submitPlay = async (req, res) => {
  try {
    const client = await pool.connect()
    const { play_type, start_yard, end_yard, down, distance, ball_on, result, possession_team_id, players, isTurnover, defSafety } = req.body
    const isScoreHome = possession_team_id === req.game.home_team_id && !defTurnovers.includes(result)
    let side_score = isScoreHome ? "home_score" : "away_score"
    let score_add = 0
    let newPossessionId = possession_team_id
    if (result in points) score_add = points[result]
    if (isTurnover) { newPossessionId = possession_team_id == req.game.home_team_id ? req.game.away_team_id : req.game.home_team_id }
    console.log(req.body)
    if (result === "Safety" || result === "Def Safety") {
      if (!defSafety) {
        side_score = side_score == "home_score" ? "away_score" : "home_score"
      }
    }

    await client.query('BEGIN')
    const play = await client.query(
      'INSERT INTO plays (drive_id, game_id, team_id, down, distance, start_yard, end_yard,  play_type, result, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, now()::timestamp) RETURNING *;',
      [req.game.current_drive_id, req.game.game_id, possession_team_id, down, distance, start_yard, end_yard, play_type, result])

    const game = await client.query(`UPDATE games SET ${side_score} = ${side_score} + $1, down = $2, distance = $3, ball_on_yard = $4, possession_team_id = $5 WHERE game_id = $6 RETURNING *;`, [score_add, down, distance, ball_on, newPossessionId, req.game.game_id])

    const updatesByPlayer = applyStatRules({ play_type, result, players })
    for (const [playerId, updates] of Object.entries(updatesByPlayer)) {
      const { text, values } = buildStatSQL(playerId, req.game.game_id, updates);
      await client.query(text, values);
    }

    await client.query('COMMIT;')
    res.json({ game: game.rows[0], play: play.rows[0] })
  } catch (err) {
    console.log(err.message)
    res.sendStatus(500)
  }
}

function buildStatSQL(player_id, game_id, updates) {
  const cols = updates.map(u => u.stat);
  const placeholders = cols.map((_, i) => `$${i + 3}`); // start from $3

  const insertCols = ['player_id', 'game_id', ...cols].join(', ');
  const insertVals = [`$1`, `$2`, ...placeholders].join(', ');

  const updateClause = cols
    .map(col => `${col} = player_stats.${col} + EXCLUDED.${col}`)
    .join(', ');

  const values = [player_id, game_id, ...updates.map(u => u.value)];

  const sql = `
    INSERT INTO player_stats (${insertCols})
    VALUES (${insertVals})
    ON CONFLICT (player_id, game_id)
    DO UPDATE SET ${updateClause};
  `;

  return { text: sql, values };
}

module.exports = { getAllPlays, submitPlay }