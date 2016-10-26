var http = require('http');
var url = require('url');
var mime = require('mime');

var app = function(path, port)
{
	let self = this;

	let response = function(req, res) {
		let headers = req.headers;
		let request = url.parse(req.url).pathname;
		let file = self.appPath+"/Vue"+request;

		fs.tryFile(file).then(function(){

			res.writeHead(200, {'Content-Type': mime.lookup(file), 'charset': 'UTF-8'});
			res.write(fs.readFileSync(file));
			res.end();

		}, function(){
			res.writeHead(404, {'Content-Type': 'text/plain', 'charset': 'UTF-8'});

			res.write("404 - file not found");

			res.end();
		});
	};

	let getOption = function()
	{
		return new Promise(function(resolve, reject){
			let file = path+"/config.json"
			fs.tryFile(file).then(function(){
				resolve(JSON.parse(fs.readFileSync(file)));
			}, function(){
				let defaultOptions = {
					"startscript":"index.js",
					"modelDirectory":"Model",
					"vueDirectory":"Vue",
					"controlerDirectory":"Controler"
				}
				let json = JSON.stringify(defaultOptions).replace(/[,]/g, ",\n\t").replace(/[{]/g, "{\n\t").replace(/[}]/g, "\n}");
				console.log(json);
				fs.writeFile(file, json);
				resolve(defaultOptions);
			});
		});
	}

	let listen = function(port)
	{
		server = http.createServer(response).listen(port);

		server.on('clientError', (err, socket) => {
			socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
		});
	};

	return new Promise(function(resolve, reject){
		fs.tryDirectory(path).then(function(){
			self.appPath = path;

			getOption().then(function(retour){
				console.log(retour);
			}, function(retour){
				console.log(retour);
			});

			listen(port);
			resolve(true);
		}, function(){
			reject(new Error(path+" path doesn't exist."));
		});
	});
}

module.exports = app;