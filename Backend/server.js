require('dotenv').config();
const express = require('express');
const cors = require('cors');

const db_conn = require('./dbconnection.js');
const Userapis = require('./Components/userapi.js');
const Emissionapis = require('./Components/emissionapi.js');
const authmiddleware = require('./Components/authmiddleware.js');
const getHistory = require('./Components/getHistory.js');
const suggestionengine = require('./Components/suggestionapi.js');
const commit = require('./Components/commitapi.js');

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

db_conn();

app.get('/', (req, res) => {
  res.send('CFT: RAM RAM');
});

app.post('/newuser', Userapis.adduser);
app.post('/login', Userapis.login);
app.get('/profile', authmiddleware, Userapis.getUserProfile);

app.post('/questionnaire', authmiddleware, Emissionapis.questionairecalc);
app.post('/gethistory', authmiddleware, getHistory.gethistory);
app.post('/suggestionengine', authmiddleware, suggestionengine.suggestionengine);
app.post('/commitment', authmiddleware, commit.commitToTip);
app.post('/addcommit', authmiddleware, Emissionapis.addCommit);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});