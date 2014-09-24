var restify = require('restify')

var server = restify.createServer({ name: 'sample-node-server' })

server.listen(3210, function () {
  console.log('%s listening at %s', server.name, server.url)
})

server
  .use(restify.fullResponse())
  .use(restify.bodyParser())

server.post('/store/:account', function(req, res, next) {

  console.log('Account %s', req.params)

  if(req.params.account === undefined){
    return next(new restify.InvalidArgumentError('Account must be supplied'))
  }

  console.log('Account %s', req.params.account)

  res.send(200)
})
