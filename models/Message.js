
var mongoose=require("mongoose");

const message = new Schema({
    username: {type: String, required: true},
    avatarLink: {type: String, required: true},
    message: {type: String, required: true}
  });
  
module.exports = mongoose.model('Message', message);