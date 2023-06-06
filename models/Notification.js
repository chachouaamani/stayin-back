var mongoose = require("mongoose");
//const {Schema} = mongoose;

const NotificationSchema = new mongoose.Schema({
  id_reservation: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Reservation' },
  id_user: { type: String },
  message: { type: String, },
  not_read: { type: Boolean, default: true },
},

);

module.exports = mongoose.model('Notification', NotificationSchema);
