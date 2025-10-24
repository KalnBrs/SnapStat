const pool = require('../Config/db')

const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');

const upload = multer({ dest: 'uploads/' });

const findTeamId = async (req, res, next, value) => {
  try {
    const result = await pool.query('SELECT * FROM teams WHERE team_id = $1', [value])
    if (result.rows.length === 0) return res.sendStatus(404)
    req.team = result.rows[0]
    next()
  } catch (err) {
    res.sendStatus(500)
  }
}

const getAllPlayersTeam = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM players WHERE team_id = $1;', [req.team.team_id])
    if (result.rows.length === 0) return res.status(404).send('No Players')
    res.json(result.rows)
  } catch (err) {
    res.sendStatus(500)
  }
}

const getAllTeams = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM teams;')
    if (result.rows.length === 0) return res.status(404).send('No Teams')
    res.json(result.rows)
  } catch (err) {
    res.sendStatus(500)
  }
}

const getAllTeamsUser = async (req, res) => {
  try {
    let teams = await pool.query('SELECT t.* FROM teams t JOIN teamusers tu ON t.team_id = tu.team_id WHERE tu.user_id = $1;', [req.user.user_id])
    res.json(teams.rows)
  } catch (err) {
    res.sendStatus(500)
  }
}

const updateTeam = async (req, res) => {
  const allowedColumns = ['team_name', 'abbreviation', 'color', 'logo_url', 'team_id'];
  const setClauses = [];
  const values = [];
  let index = 1;

  const body = req.body;
  for (let key in body) {
    if (!allowedColumns.includes(key)) throw new Error('Column Not allowed');
    setClauses.push(`${key} = $${index}`);
    values.push(body[key]);
    index++;
  }

  if (setClauses.length === 0 && !req.file) return res.sendStatus(406);

  values.push(req.body.team_id);
  const query = `
    UPDATE teams 
    SET ${setClauses.join(', ')} 
    WHERE team_id = $${index} 
    RETURNING team_id, team_name, abbreviation, color, logo_url;
  `;

  console.log(query)

  try {
    console.log(values)
    const result = await pool.query(query, values);
    const updatedTeam = result.rows[0];
    //console.log(result)

    if (req.file) {
      console.log("1")
      const players = [];

      await new Promise((resolve, reject) => {
        fs.createReadStream(req.file.path)
          .pipe(csv())
          .on('data', (row) => players.push(row))
          .on('end', resolve)
          .on('error', reject);
      });

      // Delete file after reading
      fs.unlinkSync(req.file.path);

      // ✅ Insert players from CSV
      for (const p of players) {
        console.log(p)

        // Basic validation — skip incomplete rows
        if (!p.Name || !p["#"]) continue;

        console.log(updatedTeam)

        await pool.query(
          `INSERT INTO players (team_id, name, number, year, position, height, weight)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            updatedTeam.team_id,
            p.Name,
            parseInt(p["#"], 10),
            p.Year || null,
            p.Position || null,
            p.Height || null,
            p.Weight ? parseInt(p.Weight, 10) : null
          ]
        );
      }
    }

    res.json({ message: 'Team updated successfully', team: updatedTeam });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update team or import players' });
  }
};

const clearTeam = async (req, res) => {
  try {
    const { team_id } = req.team;

    // Delete player stats first (for all players on this team)
    await pool.query(`
      DELETE FROM player_stats
      WHERE player_id IN (
        SELECT player_id FROM players WHERE team_id = $1
      );
    `, [team_id]);

    // Then delete the players themselves
    await pool.query(`
      DELETE FROM players WHERE team_id = $1;
    `, [team_id]);

    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const insertTeam = async (req, res) => {
  const allowedColumns = ['team_name', 'abbreviation', 'color', 'logo_url']
  const insertClauses = []
  const values = []
  const placeholders = []
  let index = 1

  const body = req.body
  for (let key in body) {
    if (!allowedColumns.includes(key)) throw new Error('Column Not allowed')
    insertClauses.push(`${key}`)
    values.push(`$${index}`)
    placeholders.push(body[key])
    index++
  }
  if (insertClauses.length === 0) return res.sendStatus(406)
  const query = `INSERT INTO teams (${insertClauses.join(', ')}) VALUES(${values.join(', ')}) RETURNING *`
  try {
    const result = await pool.query(query, placeholders)
    await pool.query(`INSERT INTO teamusers (team_id, user_id) VALUES(${result.rows[0].team_id}, '${req.user.user_id}') RETURNING *`)
    res.json(result.rows[0])
  } catch (err) {
    res.sendStatus(500)
  }
}

module.exports = { getAllTeams, insertTeam, findTeamId, updateTeam, getAllPlayersTeam, getAllTeamsUser, clearTeam }