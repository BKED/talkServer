var net = require('net');

var server = net.createServer();

server.on('listening', function() {
    console.log('Server is listening on port ' + server.address().port);
});

server.on('error', function(err) {
    console.log(err);
});

server.on('connection', function(c) {
    console.log(c.remoteAddress());
    c.on('end', function() {
        console.log('client disconnected');
    });
    c.on('data', function(data){
        var dataString = data.toString();
        var q = dataString.substr(dataString.indexOf('<'));
        if (q !== '') {
            console.log(q);
        }
    });
    c.write('Hello!');
});

module.exports = {
    server: server,
    start: function(port) {
        server.listen(port);
    }
}
