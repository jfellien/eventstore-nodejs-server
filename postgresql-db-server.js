var postgresql = require("pg");

exports.createEventStoreFor = function(connectionString, account, callback){

    postgresql.connect(connectionString, function(err, dbClient, done){

        if(err) {
            return console.error('could not connect to postgres', err);
        }

        var createIfNotExistsQuery = 'CREATE TABLE IF NOT EXISTS '
            + account
            + '('
            + 'entityId varchar(64), '
            + 'eventId varchar(64), '
            + 'eventType varchar(128), '
            + 'eventData varchar(512), '
            + 'eventTime varchar(64))';

        dbClient.query(createIfNotExistsQuery,
            function(err, result) {

                done();

                if(err) {
                    console.log('error running CREATE TABLE query : %s', err);
                }
                else{
                    console.log('EventStore for Account %s created', account);
                }

                callback(err, result);
            });
    });
};

exports.storeEvent = function(connectionString, account, parameters, callback){

    var dbClient = new postgresql.Client(connectionString);

    dbClient.connect(function(err){

            if(err) {
                return console.error('could not connect to postgres', err);
            }

            var saveEventQuery =
                'INSERT INTO '
                    + account
                    + ' (entityId, eventId, eventType, eventData, eventTime)'
                    + ' values($1, $2, $3, $4, $5)';

            dbClient.query(saveEventQuery,
                [
                    parameters.EntityId,
                    parameters.EventId,
                    parameters.EventType,
                    parameters.EventData,
                    parameters.TimeStamp
                ],
                function(err, result) {

                    dbClient.end();

                    if(err) {
                        console.log('error running INSERT query : %s', err);
                    }
                    else{
                        console.log('Event for Account %s has been written', account);
                    }

                    callback(err, result);
                });
        });
};

exports.readAllAccountEvents = function(connectionString, account, callback){

    var dbClient = new postgresql.Client(connectionString);

    dbClient.connect(function(err){

        if(err) {
            return console.error('could not connect to postgres', err);
        }

        var selectAllEventsQuery = 'SELECT entityId, eventId, eventType, eventData, eventTime FROM ' + account;

        dbClient.query(selectAllEventsQuery, function(err, result){

            dbClient.end();

            if(err) {
                console.log('error running SELECT ALL query : %s', err);
            }
            else{
                console.log('Account %s has read %s events', account, result.rows.length);
            }

            callback(err, result);
        });

    })
}

exports.readAllEntityEvents = function(connectionString, account, entityId, callback){

    var dbClient = new postgresql.Client(connectionString);

    dbClient.connect(function(err){

        if(err) {
            return console.error('could not connect to postgres', err);
        }

        var selectAllEventsQuery =
            'SELECT entityId, eventId, eventType, eventData, eventTime FROM '
                + account + ' '
                + 'WHERE entityid=$1';

        dbClient.query(selectAllEventsQuery, [entityId], function(err, result){

            dbClient.end();

            if(err) {
                console.error('error running SELECT BY ENTITY query', err);
            }
            else{
                console.log('Account %s has read %s events for entity %s', account, result.rows.length, entityId);
            }

            callback(err, result);

        });

    });
};

exports.removeEventStore = function(connectionString, account, callback){

    var dbClient = new postgresql.Client(connectionString);

    dbClient.connect(function(err){

        if(err) {
            return console.error('could not connect to postgres', err);
        }

        var removeEventStoreQuery =
            'DROP TABLE IF EXISTS ' + account;

        dbClient.query(removeEventStoreQuery, function(err, result){

            dbClient.end();


            if(err) {
                console.error('error running DROP TABLE query', err);
            }
            else{
                console.log('Account %s have removed its event store', account);
            }

            callback(err, result);

        });

    });

};

