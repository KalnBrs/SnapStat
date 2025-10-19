const pool = require('../Config/db')

const findDriveId = async (req, res, next, value) => {
  try {
    const result = await pool.query('SELECT * FROM drives WHERE drive_id = $1', [value])
    if (result.rows.length === 0) return res.sendStatus(404)
    req.drive = result.rows[0]
    next()
  } catch (err) {
    res.sendStatus(500)
  }
}

const getDrives = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM drives WHERE game_id = $1', [req.game.game_id])
    if (result.rows.length === 0) return res.status(404).send('No drives')
    res.json(result.rows)
  } catch (err) {
    res.sendStatus(500)
  }
}

async function createDrive(gameId, teamId, startYard) {
  const query = `
    INSERT INTO drives (game_id, team_id, start_yard)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const result = await pool.query(query, [gameId, teamId, startYard]);
  await pool.query('UPDATE games SET current_drive_id = $1 WHERE game_id = $2', [
    result.rows[0].drive_id,
    gameId,
  ]);
  return result.rows[0];
}

const startDrive = async (req, res) => {
  try {
    const { game_id, team_id, start_yard } = req.body;
    const drive = await createDrive(game_id, team_id, start_yard);
    res.json(drive);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const endDrive = async (req, res) => {
  const allowedColumns = ['end_yard', 'result']
  const setClauses = []
  const values = []
  let index = 1

  const body = req.body
  for (let key in body) {
    if (!allowedColumns.includes(key)) throw new Error('Column Not allowed')
    setClauses.push(`${key} = $${index}`)
    values.push(body[key])
    index++
  }
  if (setClauses.length === 0) return res.sendStatus(406)
  values.push(req.drive.drive_id)
  const query = `UPDATE drives SET ${setClauses.join(', ')} WHERE drive_id = $${index} RETURNING *`
  try {
    const result = await pool.query(query, values)
    await pool.query('UPDATE games SET current_drive_id = null WHERE game_id = $1', [req.game.game_id]) 
    res.json(result.rows[0])
  } catch (err) {
    res.sendStatus(500)
  }
}

module.exports = { getDrives, startDrive, endDrive, findDriveId, createDrive }