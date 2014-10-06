'use strict';

var aerospike = require('aerospike');
var asConfig = require('./aerospike_config');
var aerospikeConfig = asConfig.aerospikeConfig();
var aerospikeDBParams = asConfig.aerospikeDBParams();

var client = aerospike.client(aerospikeConfig);

// Establish connection to the cluster
exports.connect = function(callback) {
    client.connect(function(response) {
        return callback(response.code);
    });
};

// Write a record
exports.writeRecord = function(k, v, callback) {
    var key = aerospike.key(aerospikeDBParams.defaultNamespace,aerospikeDBParams.defaultSet,k);

    client.put(key, {greet:v}, function(err, rec, meta) {
        // Check for errors
        if ( err.code === aerospike.status.AEROSPIKE_OK ) {
            return callback({status:0,message:'ok'});
        } else {
            // An error occurred
            return callback({status:-1,message:err});
        }
    });
};

// Read a record
exports.readRecord = function(k, callback) {
    var key = aerospike.key(aerospikeDBParams.defaultNamespace,aerospikeDBParams.defaultSet,k);
    
    client.get(key, function(err, rec, meta) {
        // Check for errors
        if ( err.code === aerospike.status.AEROSPIKE_OK ) {
            return callback({status:0,message:k + ' ' + rec.greet});
        }
        else {
            // An error occurred
            return callback({status:-1,message:'Record not found!'});
        }
    });
};