
var restify = require('restify');

var pg = require("pg");
var connectionString = "pg://OpenSpaceGuest:OpenSpace2014@localhost:5432/OpenSpace";


var server = restify.createServer({ name: 'sample-node-server' });

server.listen(3000, function () {
    console.log('%s listening at %s', server.name, server.url)
});

server
  .use(restify.fullResponse())
  .use(restify.bodyParser())


// Define Routes

server.post('/store', unableToStoreEvent);
server.post('/store/:account', storeEvent);


// Define actions

function unableToStoreEvent(req, res, next) {

    console.log('Account must be supplied')

    res.send(404, "Account must be supplied")
}

function storeEvent(req, res, next) {

    // Check for existing Account Parameter
    if (req.params.account === undefined) {

        console.log('Account must be supplied');

        return next(new restify.InvalidArgumentError('Account must be supplied'))
    }

    var account = req.params.account;
    var parameters = req.params;

    console.log('Account %s', account);

    var dbClient = new pg.Client(connectionString);

    dbClient.connect(function(err){

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

                if(err) {
                    return console.error('error running query', err);
                }

                var saveEventQuery = 'INSERT INTO '
                    + account
                    + '(entityId, eventId, eventType, eventData, eventTime) '
                    + 'values($1, $2, $3, $4, $5)';

                dbClient.query(saveEventQuery,
                    [
                        parameters.EntityId,
                        parameters.EventId,
                        parameters.EventType,
                        parameters.EventData,
                        parameters.TimeStamp
                    ],
                    function(err, result) {

                        if(err) {
                            return console.error('error running query', err);
                        }

                        dbClient.end();
                    });
        });

    });

    res.send(200)
}
