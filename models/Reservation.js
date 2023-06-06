var mongoose=require("mongoose");
//const {Schema} = mongoose;

const RservationSchema = new mongoose.Schema({
  id: {type:mongoose.Schema.Types.ObjectId, required:true, ref:'Appartement'},
  user: {type:String},
  checkIn: {type:Date, required:true},
  checkOut: {type:Date, required:true},
  name: {type:String, required:true},
  phone: {type:String, required:true},
  pending:{type:Boolean,default:true},
  price: Number,
  pending:{type:Boolean , default:true},
},
 {timestamps:true}
);

module.exports=mongoose.model('Reservation', RservationSchema);
