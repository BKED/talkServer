var net = require('net');

var server = net.createServer();

server.on('listening', function() {
    console.log('Server is listening on port ' + server.address().port);
});

server.on('error', function(err) {
    console.log(err);
});

server.on('connection', function(c) {
    console.log('client connected');
    c.on('end', function() {
        console.log('client disconnected');
    });
    c.write('hello\r\n');
    c.pipe(c);
});

module.exports = {
    server: server,
    start: function(port) {
        server.listen(port);
    }
}
