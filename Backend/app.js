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
app.use('/api/auth', authRoute)

app.get('/', (req, res) => {
  res.send('Welcome to the API')
})

module.exports = app