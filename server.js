var express = require("express");

var ws = require("nodejs-websocket")

var wsPort = 3001;

ws.createServer(function (connection) {
    
    console.log("New connection");
        
    connection.on("text", function (input) {
                
        console.log("Request " + input);
        
        var response = {
            file: input,
            content: require(input)
        };
                        
        connection.send(JSON.stringify(response), function () { });
    });

    connection.on("close", function (code, reason) {
        console.log("Connection closed");
    });

}).listen(wsPort)

console.log("Websockets listening at port " + wsPort);

var app = express();

var port = 3000;

app.use('/node_modules', express.static(__dirname + '/node_modules'));

app.use('/resources', express.static(__dirname + '/resources'));
app.use('/images', express.static(__dirname + '/resources/images'));
app.use('/webgl', express.static(__dirname + '/app/webgl'));
app.use('/model', express.static(__dirname + '/app/model'));
app.use('/utils', express.static(__dirname + '/utils'));
app.use('/app', express.static(__dirname + '/app'));

app.use(express.static(__dirname + '/view'));
app.get('/*', function (req, res) {
    res.sendFile(__dirname + '/view/index.html');
});
app.listen(port);

console.log("App running at port " + port);