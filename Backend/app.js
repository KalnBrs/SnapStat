const cors = require('cors')
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');

app.use(express.json())
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,             
}))
app.use(cookieParser())


const authRoute = require('./Routes/auth')
const usersRoute = require('./Routes/users')
const teamsRoute = require('./Routes/teams')
app.use('/api/auth', authRoute)
app.use('/api/users', usersRoute)
app.use('/api/teams', teamsRoute)

app.get('/', (req, res) => {
  res.send('Welcome to the API')
})

module.exports = app