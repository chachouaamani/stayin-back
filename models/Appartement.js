var mongoose=require("mongoose");
//const {Schema} = mongoose;

const AppartementSchema = new mongoose.Schema({
    owner: {type:mongoose.Schema.Types.ObjectId, ref:'User'},
    title: String,
    address: String,
    photos: [String],
    description: String,
    perks: [String],
    extraInfo: String,
    checkIn: Number,
    checkOut: Number,
    maxGuests: Number,
    price: Number,
    reservedDates:[Date],
    reserved: {type: Boolean , default:false},
}
);

module.exports=mongoose.model('Appartement', AppartementSchema);
