require('dotenv').config();
const mongoose = require("mongoose");

const connect = async () => {
    try {
        if (!process.env.URL) {
            throw new Error("MongoDB connection api is not available");
        }
        response=await mongoose.connect(process.env.URL)
        console.log("db connected");
    }
    catch (e) {
        console.log(e.message);
        process.exit(1);
    }
}
module.exports = connect;