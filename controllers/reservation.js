var Reservation = require("../models/Reservation.js");
var Appartement = require("../models/Appartement.js");
var eventBus = require("../Events/eventBus.js");
var events = require("../Events/events.js");
const jwt = require('jsonwebtoken');
var mongoose = require("mongoose");
const db=require("../Events/database.js")
const fetch = require('node-fetch');

const jwtSecret = 'fasefraw4r5r3wq45wdfgw34twdfg';
const AppartementEvent = require("../models/AppartementEvent.js");
const notifier = require('node-notifier');

/* var express = require("express");
var app = express();


server = require('http').createServer(app)  
 
const io = require('socket.io')(server, { 
  cors: { 
    origin: "http://localhost:3000", 
    methods: ["GET", "POST"] 
  } 
});  */


function NewGUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
  });
}

function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      resolve(userData);
    });
  });
}
/*
 function getReservedDates(appartementId){
  Appartement.findById(appartementId)
  .then(appartement => {
    
    let reservedDates = appartement.reservedDates;
   // console.log(reservedDates);
    
  })
  .catch(err => {
    console.error('Une erreur s\'est produite lors de la recherche de l\'appartement :', err);
  });
 
  return ("aaaa"+reservedDates);
} */
async function getReservedDates(appartementId) {

  try {
    const appartement = await AppartementEvent.findOne({idAppartement : appartementId});
    //const appartement = await AppartementEvent.findById(appartementId);
    
    var reservedDates = appartement.reservedDates;
    console.log(reservedDates)
    return reservedDates;
    
  } catch (err) {
    console.error('Une erreur s\'est produite lors de la recherche de l\'appartement :', err);
  }
}


function isInArray(array, value) {

  for (let i = 0; i < array.length; i++) {
    if (array[i].getTime() == value.getTime())
      return true;
  }

  return false;
}



async function isAvailable(appartementId, checkIn, checkOut) {
  var reservedDates = await getReservedDates(appartementId);
  // console.log(reservedDates)
  var checkIn = new Date(checkIn);
  var checkOut = new Date(checkOut);

  var isAvailable = true;

  while (checkIn <= checkOut && isAvailable) {
    if (isInArray(reservedDates, checkIn)) {
      isAvailable = false;
    } else {
      checkIn.setDate(checkIn.getDate() + 1);
    }
  }

  return isAvailable;


}

const createReservation = async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {id} = req.params;
  console.log(reservedDates)
  const {   checkIn, checkOut, numberOfGuests, name, phone,email, price, user, reserved } = req.body;
 
  if (await isAvailable(id, checkIn, checkOut)) {
    
     var reservedDates = await getReservedDates(id);
     console.log(reservedDates)
     const checkInn = new Date(Date.parse(checkIn));
     const checkOutt = new Date(Date.parse(checkOut));



    while (checkInn <= checkOutt) {
      reservedDates.push(new Date(Date.parse(checkInn)));
      checkInn.setDate(checkInn.getDate() + 1);
    }
    console.log('dates  ', reservedDates);
    
    try {

      var doc = await Reservation.create({
        appartement, checkIn, checkOut, numberOfGuests, name, phone, price, user, reserved,pending
      });
      await res.json(doc);
      var result = await AppartementEvent.findOneAndUpdate({idAppartement : id} , { reserved: true, reservedDates: reservedDates});

      console.log('appartement réservée', result);

      io.on('connection', (socket) => { 
        console.log("socket id: " + socket.id); 
       
        const specificClient = user; // Replace with the specific client's socket ID
        socket.to(specificClient).emit('customEvent', 'Hello specific client!' );

        socket.on('disconnect', () => { 
          console.log('A user disconnected'); 
        }); 
        });
       
      
    

      eventBus.Publish(
        new events.ReservationCreatedEvent(
            NewGUID(),
            (new Date()).toISOString(),
            doc._id,
            id,
            user,
            checkIn,
            checkOut,
            numberOfGuests,
            name,
            phone,
            email,
            price,
            reservedDates
             
          )
      )
   

    //send create order

      //hado kaml ytbdlo 
    //when user click cancel
    var cancelUrl="http://localhost:3000/";
    //return when user click pay
    var returnUrl="http://localhost:3000/";

    var paymentBody = {
      ReservationId: doc._id,
      Amount: price,
      CurrencyCode: "USD",
      PaymentDate: new Date(),
      CancelUrl: cancelUrl,
      ReturnUrl: returnUrl,
    }
    ///hada mb3d nbdloh fih l address ta3 l payment 
    var host = "http://localhost:5001/create/order"
    var result = await fetch(host,{
      method:'Post',
      body: JSON.stringify(paymentBody),
      headers:{"Content-Type":"application/json"}

    });
    var paymentResult = await result.json();
      console.log('Payment result:', paymentResult);

      await res.json(doc);



    } catch (err) {

      console.error('Une erreur s\'est produite :', err);
    }
  }
  else
    console.log("reservation refus");
  
}

//   }
// };



const getReservations = async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  // const userData = await getUserDataFromReq(req); 

  res.json(await Reservation.find());
};

  




module.exports.createReservation = createReservation;
module.exports.getReservations = getReservations;


