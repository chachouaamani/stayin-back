// Requirements:
// All created events must inherit from BaseEvent
// Check your constraints carefully when generating the event (in the constructor)
// Event name is important it must be consistent across all microservices

// To handle the event you can either call the handle method in the event and implement it
// or do it some other way that helps you



// Check if a string is empty
function IsEmpty(string) {
    return (!string || string.length === 0);
}

// Base event for all events that will be published/consumed by our application
class BaseEvent {
    constructor(eventId, publishedTime) {

        if (IsEmpty(eventId))
            throw Error("ERROR: Empty field");

        if (publishedTime == null || publishedTime == undefined)
            throw Error("ERROR: Empty field");

        // The unique identifier of this event
        this.EventId = eventId;

        // The time at which this event was created and published
        this.PublishedTime = publishedTime;
    }

    // Handles an event and stores adequate data in the data store
    Handle(dataAccess) {
        throw Error("This method is not implemented")
    }
}

// The event that will get published when a user got created
class UserCreatedEvent extends BaseEvent {

    constructor(eventId, publishedTime, userId, username, email, phoneNumber) {

        // Call base constructor
        super(eventId, publishedTime);

        if (IsEmpty(userId))
            throw Error("ERROR: Empty field");

        if (IsEmpty(username))
            throw Error("ERROR: Empty field");

        if (IsEmpty(email))
            throw Error("ERROR: Empty field");

        // The id of the created user
        this.UserId = userId;

        // The username of the user
        this.Username = username;

        // The email of the user
        this.Email = email;

        // The phone number of the user
        this.PhoneNumber = phoneNumber;
    }

    Handle() {
        // TODO: Add data to the database
    }
}

class ReservationCreatedEvent extends BaseEvent{
    constructor(eventId, publishedTime, _id, appartement , user,nbBeds, checkOut,numberOfGuests, name , phone, email , price , reservedDates) {

        // Call base constructor
        super(eventId, publishedTime);

        if (IsEmpty(appartement))
            throw Error("ERROR: Empty field");

        if (IsEmpty(user))
            throw Error("ERROR: Empty field");

        if (IsEmpty(nbBeds))
            throw Error("ERROR: Empty field");

        if (IsEmpty(checkOut))
            throw Error("ERROR: Empty field");
       this._id=_id;
       this.appartement=appartement;
       this.user=user;
       this.nbBeds=nbBeds;
       this.checkOut=checkOut;
       this. numberOfGuests=numberOfGuests;
       this.name=name;
       this.phone=phone;
       this.email=email;
       this.price=price;
       this.reservedDates=reservedDates;
    }

    Handle() {
        // TODO: Add data to the database
    }


}


module.exports.BaseEvent=BaseEvent;
module.exports.UserCreatedEvent=UserCreatedEvent;
module.exports.ReservationCreatedEvent=ReservationCreatedEvent;
