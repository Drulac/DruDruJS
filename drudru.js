fs = require("fs");
util = require("util");

let requireClass = function(name)
{
	return require("./class/"+name+".js");
}

var app = requireClass("app");

var apps = [];

let loadApp = function(path, port)
{
	let a = new app(path, port);
	apps.push(a);
	return a;
}

fs.tryFile = function(path)
{
	return new Promise(function(resolve, reject){
		try {
			stats = fs.lstatSync(path);

			if (stats.isFile())
			{
				resolve(true);
			}else{
				reject(new Error(path+" file doesn't exist."));
			}
		} catch (e) {
			reject(new Error(path+" file doesn't exist."));
		}
	});
};

fs.tryDirectory = function(path)
{
	return new Promise(function(resolve, reject){
		try {
			stats = fs.lstatSync(path);

			if (stats.isDirectory())
			{
				resolve(true);
			}else{
				reject(new Error(path+" path doesn't exist."));
			}
		} catch (e) {
			reject(new Error(path+" path doesn't exist."));
		}
	});
};

module.exports.loadApp = loadApp;