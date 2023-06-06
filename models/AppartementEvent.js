const mongoose= require("mongoose");
const connectionString = "mongodb+srv://amani_ch:amani217@cluster0.jje24xc.mongodb.net/ms-reservation";
const eventTableName = "events"

const eventAppartementSchema = mongoose.Schema({
    EventId: String,
    PublishedTime: String,
    idAppartement: {type:mongoose.Schema.Types.ObjectId},
    title :String ,
    wilaya: String,
    comun : String,
    street : String, 
    photos :[String],
    description : String,
    perks : [String],
    extraInfo: String , 
    checkIn : Number, 
    checkOut :Number , 
    maxGuests : Number,
    price: Number,
    price_month:Number,
    reservedDates:[{
        type: Date,
        default:[]}]
});

module.exports=mongoose.model('EventAppartement', eventAppartementSchema);

 