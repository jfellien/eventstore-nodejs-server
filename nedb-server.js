var dataStore = require('nedb')
    , db = new dataStore({filename: 'data/neddb-eventstore', autoload : true});

exports.storeEvent = function(account, parameters, callback){

    var accountEvent = {
        account   : account,
        entityId  : parameters.EntityId,
        eventId   : parameters.EventId,
        eventType : parameters.EventType,
        eventData : parameters.EventData,
        timeStamp : parameters.TimeStamp
    };

    db.insert(accountEvent, callback);
};

exports.readAllAccountEvents = function(account, callback){

    db.find({account : account}, callback);

};

exports.readAllEntityEvents = function(account, entityId, callback){

    db.find({account : account, entityId : entityId}, callback)
};

exports.removeEventStore = function(account, callback){

    db.remove({account : account}, {multi : true}, callback)
};