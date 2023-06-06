var express=require("express");
var controller = require("../controllers/reservation.js");

//var Reservation=require("../models/Reservation.js")

const router=express.Router();

//CREATE     
router.post("/reservation/createReservation/:id" , controller.createReservation);
//GET ALL 
router.get("/reservation/getReservations/" , controller.getReservations); 


//export default router;
module.exports=router;