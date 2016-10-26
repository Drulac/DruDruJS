var MongoClient = require("mongodb").MongoClient;

let self = module.exports;

self.connect = function(url){
	return new Promise(function(resolve, reject){
		MongoClient.connect("mongodb://"+url, function(error, db) {
			if (error) reject(error);

			resolve(true);
		});
	});
}