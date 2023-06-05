var mongoose=require("mongoose");
//const {Schema} = mongoose;

const RservationSchema = new mongoose.Schema({
  id: {type:mongoose.Schema.Types.ObjectId, required:true, ref:'Appartement'},
  user: {type:mongoose.Schema.Types.ObjectId, required:true},
  checkIn: {type:Date, required:true},
  checkOut: {type:Date, required:true},
  name: {type:String, required:true},
  phone: {type:String, required:true},
  price: Number,
 // pending:Boolean,
},
 {timestamps:true}
);

module.exports=mongoose.model('Reservation', RservationSchema);
