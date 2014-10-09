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

    db.insert(accountEvent);
};

exports.readAllAccountEvents = function(account, callback){

    db.find({account : account}, function(err, events){

        callback(err, events);

    });

};

exports.readAllEntityEvents = function(account, entityId, callback){

    db.find({account : account, entityId : entityId}, function(err, events){

        callback(err, events);

    })
};

exports.removeEventStore = function(account, callback){

    db.remove({account : account}, function(err, result){

        callback(err, result);

    })
};