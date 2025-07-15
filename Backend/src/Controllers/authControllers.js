const jwt = require('jsonwebtoken')
const pool = require('../Config/db')
const bcrypt = require('bcrypt')
const redisClient = require('../Config/redisClient')

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

const login = async (req, res) => {
  const users = await pool.query('SELECT * FROM users WHERE username = $1;', [req.body.username])
  const user1 = users.rows[0]
  if (user1 == null) return res.status(404).send('Could not find user')
  try {
    if (await bcrypt.compare(req.body.password, user1.password)) {
      const username = user1.username
      const role = user1.role
      const user = { username: username, role: role }
      const accessToken = generateAccessToken(user)
      const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })

      await redisClient.set(refreshToken, JSON.stringify(user), {
        EX: 7 * 24 * 60 * 60
      })

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
        path: 'api/auth/refresh',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.json({ accessToken: accessToken, user: user })
    } else {
      res.send('Not Allowed')
    }
  } catch (err) {
    res.status(500).send(err.message)
  }
}

const logout = async (req, res) => {
  const token = req.cookies.refreshToken;

  if (token) {
    await redisClient.del(token);
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
      path: 'api/auth/refresh',
    });
  }

  res.sendStatus(204);
}

const register = async (req, res) => {
  try {
    let { email } = req.body
    if (email == undefined) email = null;
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    pool.query(' INSERT INTO users (user_id, username, email, password) VALUES (uuid_generate_v4(), $1, $2, $3);', [req.body.username, email, hashedPassword])
    res.sendStatus(201)
  } catch (err) {
    res.sendStatus(500)
  }
}

const refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken
  if (!refreshToken) return res.sendStatus(401)
  try {
    const verify = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)

    const storedUser = JSON.parse(await redisClient.get(refreshToken))
    if (!storedUser || storedUser.username !== verify.username) return res.sendStatus(403)

    const newToken = generateAccessToken(storedUser)
    res.json({ accessToken: newToken })
  } catch (err) {
    res.status(500).send(err.message)
  }
}

const getMe = async (req, res) => {
  const users = await pool.query('SELECT * FROM users WHERE username = $1', [req.body.username])
  if (!users) return res.sendStatus(404)
  res.json(users.rows[0])
}

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' })
}

module.exports = { authenticateToken, login, logout, register, refresh, getMe }