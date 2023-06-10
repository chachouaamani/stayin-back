var express = require("express");
var dotenv = require("dotenv");
const mongoose = require("mongoose");
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
const Reservation = require('./models/Reservation.js')
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
app.get("/notification/setread/:id" , controllerr.setReservationRead);
app.get("/reservation/getBookingsByUser/:user" , controllerr.getBookingsByUser);
app.get("/notification/:userid" , controllerr.getNotificationsByUser);



// app.patch("/reservation/validate/:ReservationId/:token/:PayerID", controllerr.validateReservation)

// Route to update the pending field of a reservation
app.get('/reservation/validate/', async (req, res) => {

  mongoose.connect(process.env.MONGO_URL);
  const reservationId = req.query.ReservationId;

  console.log(req.query)
  try {
    const reservation = await Reservation.findById(reservationId);
    console.log(reservation)
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    reservation.pending = false;
    await reservation.save();
    

    return res.redirect("http://localhost:5050/account/bookings/"+reservationId)
  } catch (error) {
    // console.log('Error updating reservation:', error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
});

app.get("/reservation/getUserWithBooking" , controllerr.getBookingsByUser);
// app.get("/notification/:userid" , controllerr.getNotificationsByUser);
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

// Server-side route to handle reservation update
// app.patch('/reservation/validate/:id/:token/:PayerId', async (req, res) => {
//     const reservationId = req.params.id;
//     const updatedField = req.body.updatedField;
  
//     try {
//       // Update the field within the collection using Mongoose
//       const updatedReservation = await Reservation.findByIdAndUpdate(
//         reservationId,
//         { $set: { fieldToUpdate: updatedField } },
//         { new: true } // to return the updated document
//       );
  
//       // Check if the reservation was found and updated
//       if (!updatedReservation) {
//         return res.status(404).json({ error: 'Reservation not found' });
//       }
  
//       // Send a success response
//       return res.json({ message: 'Reservation updated successfully' });
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json({ error: 'Internal server error' });
//     }
//   });
  

async function ReadNewEvents() {
    var newEvents =await eventBus.GetNewEvents();
    
    for (let i = 0; i < newEvents.length; i++) {
        const message = newEvents[i];
     /*    if(message.Type == "UserCreatedEvent")
        db.InsertUser(message.body); */
        if(message.Type == "AppartementCreatedEvent")
        await appartementEvent.InsertEventAppartement(message.body); 
       console.log(message.body)
    }
}


setInterval(ReadNewEvents, 5000);

app.listen(9000, () => {
    connect()
    console.log("connected to backend")
}) 