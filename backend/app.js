const express = require('express');
const app = express();
const errorMiddleware = require('./middleware/error');

app.use(express.json());
//Route imports
const product = require('./Routes/productRoute')

app.use("/api",product)

//middleware error
app.use(errorMiddleware);

module.exports = app


