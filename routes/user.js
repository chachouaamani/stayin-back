var express=require("express");
var controller = require("../controllers/user.js");
//var Reservation=require("../models/Reservation.js")

const router=express.Router();

//CREATE
router.post("/user/createUser" , controller.createUser);
router.post("/user/login" , controller.login);
//GET ALL 


router.get('/user/profile',controller.user); 
//export default router;
module.exports=router;