const mongoose = require("mongoose");
const dotenv = require('dotenv');
const connectDataBase = () => {
    mongoose.connect(process.env.DB_URI).then(()=>{
        console.log("connection was suuccessful");
    }).catch((err)=>{
        console.log(err);
    });
};

module.exports = connectDataBase;
