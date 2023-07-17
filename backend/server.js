const app = require('./app');
const dotenv = require('dotenv')
const connectDataBase = require('./config/database');
dotenv.config({path : "backend/config/config.env"});

// uncaught exception

process.on("uncaughtException",(err)=>{
    console.log(err);
    console.log("server shutting down");
    process.exit(1);
});

//database
connectDataBase();


const server = app.listen(process.env.PORT,()=>{
    console.log(`server is fine and running on port ${process.env.PORT}`);
});
//unhandled promise rejction
process.on("unhandledRejection",(err)=>{
    console.log(err);
    console.log("shutting down the sever");

    server.close(()=>{
        process.exit(1);
    })
})