var Reservation=require("../models/Reservation.js");
var Appartement=require("../models/Appartement.js");
const jwt = require('jsonwebtoken');
var mongoose=require("mongoose");

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


  function isAvailable(apartmentId, checkIn, checkOut) {
  /*   mongoose.connect(process.env.MONGO_URL); */
    var reservedDates = Appartement.findById(apartmentId).reservedDates;  
    const start = new Date(checkIn);
    const end = new Date(checkOut);
  
    for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
    //  const dateString = date.toISOString().substring(0, 10);
      if (reservedDates.includes(date)) {
        return false;
      }
    }
    return true;
  }

const createReservation =  async (req, res) => {
    mongoose.connect(process.env.MONGO_URL);
   /*  const userData = await getUserDataFromReq(req); */
    const {
      appartement,checkIn,checkOut,numberOfGuests, name , phone, price,user,reserved
    } = req.body;
    if (isAvailable(appartement , checkIn, checkOut)){
      for (let date = checkIn; date <= checkOut; date.setDate(date.getDate() + 1)) {
      //  const dateString = date.toISOString().substring(0, 10);
        reservedDates.push(date);
        
      }
      Reservation.create({
        appartement,checkIn,checkOut,numberOfGuests, name , phone, price,user,reservedDates,reserved
      
       /*  user:userData.id,  */
      }).then((doc) => {
        res.json(doc);
        Appartement.findByIdAndUpdate('6452c936bf0a60e911de6a8c', { reserved: true } , reservedDates).then((appartement) => {
          console.log('appartement réservée',appartement);
        })
          .catch((err) => {
            console.error('Une erreur s\'est produite :', err);
          });
          
          eventBus.Publish(
            new events.ReservationCreatedEvent(
               NewGUID(),
                (new Date()).toISOString(),
                NewGUID(),
                appartement,
                checkIn,
                checkOut,
                numberOfGuests,
                name,
                phone,
                price,
                user,
                reservedDates,
                reserved
                 
              )
          )
       
      
        
      }).catch((err) => {
        throw err;
      });
    }else {
      console.log("reservation refus");
    }
    
  };





const getReservations =  async (req,res) => {
    mongoose.connect(process.env.MONGO_URL);
  /*  const userData = await getUserDataFromReq(req); */
    
    res.json( await Reservation.find());
  };
  




module.exports.createReservation=createReservation;
 module.exports.getReservations=getReservations;