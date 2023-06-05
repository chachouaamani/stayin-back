var amqp = require('amqplib');

var db = require("./database.js");
var events = require("./events.js");


// The url to the rabbitMQ Bus
const url = 'amqps://hwtyemoo:cglmvY7Sbql86_WX2wZwk_DhamrqY-5_@goose.rmq2.cloudamqp.com/hwtyemoo';

// The name of the queue to publish messages to
const queueName = 'DefaultQueue';


// Return true if the passed in event id exists in the list of events
function Consumed(eventsList, eventId) {
    for (var i = 0; i < eventsList.length; i++) {
        var currentEvent = eventsList[i];
        if (currentEvent.EventId == eventId)
            return true;
    }
    return false;
}



// Publishes a new Event to a queue
// message: a javascript object representing the event to send (a class that must inherit from BaseEvent)
async function Publish(event) {
    // Get the body of the message to publish
    var body = JSON.stringify(event);

    // Create a connection
    var connection = await amqp.connect(url);

    // Create a channel
    var channel = await connection.createChannel();

    // The options to add to the message
    var options = {
        // Persistent in disk (doesn't get deleted if we turn off the server)
        persistent: true,
        // The id of the created event
        messageId: event.EventId,
        // The type of the event to send
        type: event.constructor.name
    };

    // Assert tha the queue exists
    await channel.assertQueue(queueName, { durable: true });

    // Send the message to the queue
    channel.sendToQueue(queueName, Buffer.from(body), options);

    // Close the channel
    await channel.close();

    // Close the connection
    await connection.close();
}


// Returns a list of new Events that have not yet been consumed
async function GetNewEvents() {
    // Create a connection
    var connection = await amqp.connect(url);

    // Create a channel
    var channel = await connection.createChannel();

    // Assert tha the queue exists
    await channel.assertQueue(queueName, { durable: true });

    // Get the first message
    var message = await channel.get(queueName);

    // List of new messages to return
    var messages = [];

    // Get all the events that were consumed from the database
    var consumedEvents = await db.GetAllEvents();

    // While the message is not false indicating there are no more messages
    while (message != false) {
        // If the message was not already consumed
        if (!Consumed(consumedEvents, message.properties.messageId)) { 
            // Create a new message
            var toInsert= {
                Type: message.properties.type,
                body: JSON.parse(message.content.toString())
            };
          
            
            // Add the message to the list of new messages
            messages.push(toInsert);

            // Add the event to the consumed events in the database
            db.InsertEvent(new events.BaseEvent(toInsert.body.EventId, toInsert.body.PublishedTime));
        }

        // Get the next message
        message = await channel.get(queueName);
    }

    // Negative acknowledge all messages so they get requeued.
    channel.nackAll(true);

    // Close the channel
    await channel.close();

    // Close the connection
    await connection.close();

    // Return the list of messages
    return messages;
}



module.exports.GetNewEvents = GetNewEvents;
module.exports.Publish = Publish;
