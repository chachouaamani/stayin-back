var mongoose = require("mongoose");
const EventAppartement = require("../models/AppartementEvent.js")

 const getAppartementId = async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { id } = req.params;
  console.log({ id });
  res.json(await EventAppartement.findOne({ idAppartement: id }))
} 

module.exports.getAppartementId = getAppartementId;

async function InsertEventAppartement(Event) {

  await mongoose.connect(process.env.MONGO_URL);

  var eve = new EventAppartement({
    idAppartement: Event._id,
    owner: Event.owner,
    title: Event.title,
    wilaya: Event.wilaya,
    comun: Event.comun,
    street: Event.street,
    photos: Event.photos,
    description: Event.description,
    perks: Event.perks,
    extraInfo: Event.extraInfo,
    nbBeds: Event.nbBeds,
    checkOut: Event.checkOut,
    maxGuests: Event.maxGuests,
    price: Event.price,
    price_month: Event.price_month,
    reservedDates: Event.reservedDates,
  })
  await eve.save();
}

module.exports.InsertEventAppartement = InsertEventAppartement;

