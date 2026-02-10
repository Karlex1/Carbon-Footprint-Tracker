// require('dotenv').config()
const User = require('../Schemas/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.adduser = async (req, res) => {
    //console.log(req.body);
    try {
        const { username, name, mobileno, password } = req.body
        if (!username || !name || !mobileno || !password) {
            return res.status(400).json({ message: "all fields are required" })
        }
        const usernamecheck = await User.findOne({ username })
        if (usernamecheck) {
            return res.status(409).json({ message: "You are already registered. Kindly login..." })
        }
        const cryptpass = await bcrypt.hash(password, Number(process.env.SALT) || 10)
        const newuser = new User({ username, name, mobileno, password: cryptpass });
        await newuser.save();

        const token = jwt.sign({ id: newuser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        return res.status(201).json({ token, user: { id: newuser._id, name: newuser.username } });
    }
    catch (e) {
        console.log('user register not successful due to ', e.message)
        return res.status(500).json({ message: "server error" })
    }
}
exports.login = async (req, res) => {
    try {
        const currUser = await User.findOne({ username: req.body.username })
        if (!currUser) {
            return res.status(404).json({ message: "user not found" })
        }
        const isMatch = await bcrypt.compare(req.body.password, currUser.password)
        if (!isMatch) {
            return res.status(401).json({ message: "password not matched" })
        }
        const token = jwt.sign({ id: currUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({ token, user: { id: currUser._id, name: currUser.username } })
    }
    catch (e) {
        console.log(e.message);
    }
}