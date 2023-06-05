
const mongoose= require("mongoose");
const connectionString = "mongodb+srv://amani_ch:amani217@cluster0.jje24xc.mongodb.net/ms-reservation";
const eventTableName = "events"

const eventSchema = mongoose.Schema({
    EventId: String,
    PublishedTime: String
});



const Event = mongoose.model(eventTableName, eventSchema);





async function InsertEvent(newEvent) {
    await mongoose.connect(connectionString);

    var eve = new Event({ EventId: newEvent.EventId, PublishedTime: newEvent.PublishedTime });

    await eve.save();
}




async function GetAllEvents() {
    await mongoose.connect(connectionString);

    return await Event.find();
}

function InsertUser(userInfo){
    console.log(userInfo);
} 


module.exports.GetAllEvents= GetAllEvents ;
module.exports.InsertEvent=InsertEvent;
module.exports.InsertUser=InsertUser;


