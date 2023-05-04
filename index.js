var express = require("express");
var dotenv = require("dotenv");
var mongoose = require("mongoose");
var reservationRoute = require("./routes/reservations.js");
var userRoute = require("./routes/user.js");
var appartementRoute = require("./routes/appartement.js");

var db = require("./Events/database.js");
var events = require("./Events/events.js");
var eventBus = require("./Events/eventBus.js");



const cors = require("cors");

const cookieParser = require('cookie-parser');

var app = express();

dotenv.config()

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("connected to mongoDB.")
    } catch (error) {
        throw error
    }
};

mongoose.connection.on("disconnected", () => {
    console.log("mongoDB disconnected")
})

//middlewares

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000',
    CORS: "AllowAll",
}));

app.use(express.json())
app.use(cookieParser());

app.use("/ms-reservation", reservationRoute);
app.use("/ms-reservation", userRoute);
app.use("/ms-reservation", appartementRoute);

app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong";
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack,
    });
});



async function ReadNewEvents() {
    var newEvents =await eventBus.GetNewEvents();
    
    for (let i = 0; i < newEvents.length; i++) {
        const message = newEvents[i];
        if(message.Type == "UserCreatedEvent")
        db.InsertUser(message.body);
      
    }
}

setInterval(ReadNewEvents, 5000);

app.listen(8800, () => {
    connect()
    console.log("connected to backend")
})