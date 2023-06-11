const mongoose = require("mongoose");

const eventAppartementSchema = mongoose.Schema({
    idAppartement: { type: mongoose.Schema.Types.ObjectId },
    owner: String,
    title: String,
    wilaya: String,
    comun: String,
    street: String,
    photos: [String],
    description: String,
    perks: [String],
    extraInfo: String,
    nbBeds: Number,
    checkOut: Number,
    maxGuests: Number,
    price: Number,
    price_month: Number,
    reservedDates: [{
        type: Date,
        default: []
    }]
});

module.exports = mongoose.model('EventAppartement', eventAppartementSchema);

