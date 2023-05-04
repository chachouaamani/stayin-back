var db = require("./database.js");
var events = require("./events.js");
var eventBus = require("./eventBus.js");


// Returns a new unique id
function NewGUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// Testing publishing and reading events
; (async () => {
    var event = new events.UserCreatedEvent(NewGUID(), (new Date()).toISOString(), NewGUID(), "hossemcheotui", "email@hossem.com", "543533424242")

    // Insert events to the database

    await db.InsertEvent(event);
     console.log(await db.GetAllEvents())

   // Publish a message to the queue
     await eventBus.Publish(event);


     await eventBus.Publish(
       new events.UserCreatedEvent(
          NewGUID(),
           (new Date()).toISOString(),
           NewGUID(),
           "username",
           "email@hossem.com",
           "543533424242"));
            
   await eventBus.Publish(new events.UserCreatedEvent(NewGUID(), (new Date()).toISOString(), NewGUID(), "username", "email@hossem.com", "543533424242"))




    // Read new messages from the queue (messages that have not yet been consumed)
    var messages = await eventBus.GetNewEvents();
    console.log(messages);

})()


