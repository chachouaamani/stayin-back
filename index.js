var express = require("express");
var dotenv = require("dotenv");
var mongoose = require("mongoose");
var reservationRoute = require("./routes/reservations.js");
var userRoute = require("./routes/user.js");
var appartementRoute = require("./routes/appartement.js");
var appartementEventRoute = require("./routes/appartementEvent.js");
//var db=require("./Events/database.js");

var appartementEvent = require("./controllers/appartementEvent.js");
var events = require("./Events/events.js");
var eventBus = require("./Events/eventBus.js");

var controller = require("./controllers/appartementEvent.js");
var controllerr = require("./controllers/reservation.js");
const bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());
//const server = require('http').createServer(app);
//const io = require('socket.io');
//const Message = require('./models/Message');
// server = require('http').createServer(app) 
 /*
const io = require('socket.io')(server, { 
  cors: { 
    origin: "http://localhost:3000", 
    methods: ["GET", "POST"] 
  } 
});  */
 
//server.listen(8800)

const cors = require("cors");

const cookieParser = require('cookie-parser');

const usersArray = [];

dotenv.config()

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        // console.log("connected to mongoDB.")
    } catch (error) {
        throw error
    }
};

mongoose.connection.on("disconnected", () => {
    // console.log("mongoDB disconnected")
})

//middlewares

 app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000',
    CORS: "AllowAll",
}));

app.use(express.json())
app.use(cookieParser());

/* app.use("", reservationRoute);
app.use("", userRoute);
app.use("", appartementRoute);
app.use("", appartementEventRoute); */
app.get("/reservation/getAppartementId/:id", controller.getAppartementId);
//CREATE     
app.post("/reservation/createReservation/:id" , controllerr.createReservation);
//GET ALL 
app.get("/reservation/getReservations/" , controllerr.getReservations); 

app.get("/reservation/getUserWithBooking" , controllerr.getBookingsByUser);
app.get("/notification/:userid" , controllerr.getNotificationsByUser);
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
     /*    if(message.Type == "UserCreatedEvent")
        db.InsertUser(message.body); */
        if(message.Type == "AppartementCreatedEvent")
        await appartementEvent.InsertEventAppartement(message.body); 
      
    }
}


setInterval(ReadNewEvents, 5000);

 app.listen(8800, () => {
    connect()
    console.log("connected to backend")
}) 