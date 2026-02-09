require('dotenv').config();
const express = require('express');
const cors = require('cors');
var app = express();
const db_conn=require('./dbconnection.js');
const Userapis = require('./Components/userapi.js');
const Emissionapis = require('./Components/emissionapi.js');

app.use(cors());
app.use(express.json());
db_conn();
// app.use(express.json())
app.get(('/'),(req, res) => {
    res.send("CFT: RAM RAM")
})
app.post(('/newuser'), Userapis.adduser)
app.post(('/login'),Userapis.login)
app.post(('/questionaire'), Emissionapis.questionairecalc)

var port = process.env.PORT;
app.listen(port, () => { console.log('server started' )})
