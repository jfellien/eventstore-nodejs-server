eventstore-nodejs-server
========================

A sample event store. I use it on my Raspberry PI with nedb.

##How to use this server?

This server is created for a small size of database. It is possible to save events for a account. 
This account is defined by an unique ID. Any request needs this ID.

###Create a EventStore 

 ```
 POST /init/{accountid}
 ```
 
(At this moment nothing will happen after the request)

###Store an Event

 ```
 POST /store/{accountid} 
 
 body:
 { 
    "EntityId":"{Your Entity ID}",
    "EventID":"{Your Event ID}",
    "EventType":"{The type of event}",
    "EventData":"{Serialized event data}",
    "TimeStamp":"{Sortable timestamp}"
 }
 
 ```
 
 ###Read all events of an account
 
 ```
 GET /events/{accountid}

 returns a list of all events as json array
 
 [
 	{ 
    	"EntityId":"1234",
    	"EventID":"123-456",
    	"EventType":"SampleEvent",
    	"EventData":"{Serialized event data}",
    	"TimeStamp":"2014-10-01"
 	},
 	{ 
    	"EntityId":...
 	},
 	...
 ]

 ```
 ###Read all events of an entity
 
 ```
  GET /events/{accountid}/{entityid}
  
  returns a list of all events as json array
  
  [
 	{ 
    	"EntityId":"1234",
    	"EventID":"123-456",
    	"EventType":"SampleEvent",
    	"EventData":"{Serialized event data}",
    	"TimeStamp":"2014-10-01"
 	},
 	{ 
    	"EntityId":...
 	},
 	...
 ]

 ```
 
 ###Delete an event store of an account
 
 ```
 DELETE /remove/{accountid}
 ```
