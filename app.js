
var restify = require('restify');
var db_server = require('./postgresql-db-server.js');

var connectionString = "pg://OpenSpaceGuest:OpenSpace2014@localhost:5432/OpenSpace";


var server = restify.createServer({ name: 'sample-node-server' });

server.listen(3000, function () {
    console.log('%s listening at %s', server.name, server.url)
});

server
  .use(restify.fullResponse())
  .use(restify.bodyParser())


// Define Routes

server.post('/init/:account', createEventStoreIfNotExists);
server.post('/store/:account', storeEvent);
server.get('/events/:account', readAllAccountEvents);
server.get('/events/:account/:entityId', readAllEntityEvents);
server.del('/remove/:account', removeEventStoreForAnAccount);


// Define actions

function createEventStoreIfNotExists(req, res, next) {

    // Check for existing Account Parameter
    if (req.params.account === undefined) {

        console.log('Account must be supplied');

        return next(new restify.InvalidArgumentError('Account must be supplied'))
    }

    var account = req.params.account;

    console.log('Account %s will create its own event store', account);

    db_server.createEventStoreFor(connectionString, account, function(err, result){

        if(err){
            res.send(500, err);
        }

        res.send(200)
    });
}

function storeEvent(req, res, next) {

    // Check for existing Account Parameter
    if (req.params.account === undefined) {

        console.log('Account must be supplied');

        return next(new restify.InvalidArgumentError('Account must be supplied'))
    }

    var account = req.params.account;
    var parameters = req.params;

    console.log('Event with Id : %s will write for Account : %s ', parameters.EventId, account);

    db_server.storeEvent(connectionString, account, parameters, function(err, result){

        if(err){
            res.send(500, err);
        }

        res.send(200);

    });
}

function readAllAccountEvents(req,res, next){

    // Check for existing Account Parameter
    if (req.params.account === undefined) {

        console.log('Account must be supplied');

        return next(new restify.InvalidArgumentError('Account must be supplied'))
    }

    var account = req.params.account;

    console.log('Account %s will read all events', account);

    db_server.readAllAccountEvents(connectionString, account, function(err, result){
        if(err){
            res.send(500, err);
        }

        res.contentType = 'json';
        res.send(200, result.rows);
    });

}

function readAllEntityEvents(req,res, next){

    // Check for existing Account Parameter
    if (req.params.account === undefined) {

        console.log('Account must be supplied');

        return next(new restify.InvalidArgumentError('Account must be supplied'))
    }

    var account = req.params.account;
    var entityId = req.params.entityId;

    console.log('Account %s will read all events for entity %s', account, entityId);

    db_server.readAllEntityEvents(connectionString, account, entityId, function(err,result){
        if(err){
            res.send(500, err);
        }

        res.contentType = 'json';
        res.send(200, result.rows);
    })
}

function removeEventStoreForAnAccount(req, res, next){
    // Check for existing Account Parameter
    if (req.params.account === undefined) {

        console.log('Account must be supplied');

        return next(new restify.InvalidArgumentError('Account must be supplied'))
    }

    var account = req.params.account;

    console.log('Account %s will remove the event store', account);

    db_server.removeEventStore(connectionString,account, function(err, result){

        if(err){
            res.send(500, err);
        }

        res.contentType = 'json';
        res.send(200, '{"Message":"EventStore removed"}');
    });
}