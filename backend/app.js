const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const errorMiddleware = require('./middleware/error');

app.use(express.json());
app.use(cookieParser());

//Route imports
const productRoute = require('./Routes/productRoute')
const userRoute = require('./Routes/userRoute');

app.use("/api",productRoute);
app.use("/api",userRoute);

//middleware error
app.use(errorMiddleware);

module.exports = app


