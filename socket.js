var net = require('net');
var parse = require('xml-parser');
var server = net.createServer();
var userList = [];

var makeUserListString = function() {
    var out = '<SESSION_ACCEPT>';
    userList.forEach(function (user) {
        out += '<PEER>';
        out += '<PEER_NAME>'+user.name+'</PEER_NAME>';
        out += '<IP>'+user.address+'</IP>';
        out += '<PORT>'+user.port+'</PORT>'
        out += '</PEER>';
    });
    out += '</SESSION_ACCEPT>';
    return out;
}

server.on('listening', function() {
    console.log('Server is listening on port ' + server.address().port);
});

server.on('error', function(err) {
    console.log(err);
});

server.on('connection', function(c) {
    console.log(c.remoteAddress + ':' + c.remotePort + ' connected!');
    c.on('end', function() {
        console.log('a client disconnected');
    });
    c.on('data', function(data){
        var dataString = data.toString();
        var q = dataString.substr(dataString.indexOf('<'));
        var parsedData = parse(q).root;
        if (parsedData) {
            switch(parsedData.name) {
                case 'SESSION':
                    var username = parsedData.children[0].content;
                    var address = c.remoteAddress;
                    var port = parsedData.children[1].content;
                    var dup = false;
                    for (var i=0; i<userList.length; i++) {
                        if (userList[i].name === username) {
                            dup = true;
                            break;
                        }
                    }
                    if (!dup) {
                        userList.push({name: username, port: port, address: address});
                        var s = makeUserListString();
                        console.log(s);
                    }
                    else {
                        c.write('<SESSION_DENY />');
                    }
                    //
                    break;
                case 'SESSION_KEEP_ALIVE':
                    var username = parsedData.children[0].content;
                    var status = parsedData.children[1].content;
                    if (status === 'ALIVE') {
                        //TO-DO: send list online user
                    } else {
                        //TO-DO: remove this user from online list
                    }
                    break; 
            }
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
