var Reservation = require("../models/Reservation.js");
var Appartement = require("../models/Appartement.js");
var eventBus = require("../Events/eventBus.js");
var events = require("../Events/events.js");
const jwt = require('jsonwebtoken');
var mongoose = require("mongoose");
const fetch = require('node-fetch');

const jwtSecret = 'fasefraw4r5r3wq45wdfgw34twdfg';

const notifier = require('node-notifier');



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
    const appartement = await Appartement.findById(appartementId);

    var reservedDates = appartement.reservedDates;

    //  console.log(reservedDates)


    // console.log(typeof(reservedDates.toString()));
    // Divise la chaîne en utilisant la virgule comme séparateur
    /*   const str = reservedDates.toString();
    
      var  result = str.split(',');
      result= result.map(date => new Date(date));
      console.log(typeof(result)); */
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

  const { appartement, checkIn, checkOut, numberOfGuests, name, phone, price, user, reserved } = req.body;
  // console.log(appartement);
  // console.log(checkIn);
  // console.log(checkOut);
  // console.log(isAvailable(appartement, checkIn, checkOut))
  if (await isAvailable(appartement, checkIn, checkOut)) {

    var reservedDates = await getReservedDates(appartement);
    console.log("reservedDates")
    console.log(reservedDates)

    // var reservedDates = appartement.reservedDates;

    const checkInn = new Date(Date.parse(checkIn));
    const checkOutt = new Date(Date.parse(checkOut));

    /* for (let date = checkIn; date <= checkOut; date.setDate(date.getDate() + 1)) {
      var reservedDates = reservedDates.push(date);

    } */

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
      var result = await Appartement.findByIdAndUpdate(appartement, { reserved: true,reservedDates: reservedDates});

      console.log('appartement réservée', result);


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

