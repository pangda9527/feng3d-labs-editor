var http = require('http');
var WebSocketServer = require('websocket').server;

var connectionArray = [];
var nextID = Date.now();
var appendToMakeUnique = 1;

var httpsServer = http.createServer();

httpsServer.listen(6502, function ()
{
    console.log((new Date()) + " Server is listening on port 6502");
});

var wsServer = new WebSocketServer({
    httpServer: httpsServer,
    autoAcceptConnections: false
});

function isUsernameUnique(name)
{
    var isUnique = true;
    var i;

    for (i = 0; i < connectionArray.length; i++)
    {
        if (connectionArray[i].username === name)
        {
            isUnique = false;
            break;
        }
    }
    return isUnique;
}

function getConnectionForID(id)
{
    var connect = null;
    var i;

    for (i = 0; i < connectionArray.length; i++)
    {
        if (connectionArray[i].clientID === id)
        {
            connect = connectionArray[i];
            break;
        }
    }

    return connect;
}

function makeUserListMessage()
{
    var userListMsg = {
        type: "userlist",
        users: []
    };
    var i;

    for (i = 0; i < connectionArray.length; i++)
    {
        userListMsg.users.push(connectionArray[i].username);
    }

    return userListMsg;
}

function sendUserListToAll()
{
    var userListMsg = makeUserListMessage();
    var userListMsgStr = JSON.stringify(userListMsg);
    var i;

    for (i = 0; i < connectionArray.length; i++)
    {
        connectionArray[i].sendUTF(userListMsgStr);
    }
}

console.log("***CRETING REQUEST HANDLER");
wsServer.on('request', function (request)
{
    console.log("Handling request from " + request.origin);

    var connection = request.accept("json", request.origin);

    console.log((new Date()) + " Connection accepted.");
    connectionArray.push(connection);

    connection.clientID = nextID;
    nextID++;

    var msg = {
        type: "id",
        id: connection.clientID
    };
    connection.sendUTF(JSON.stringify(msg));

    connection.on('message', function (message)
    {
        console.log("***MESSAGE");
        if (message.type === 'utf8')
        {
            console.log("Received Message: " + message.utf8Data);

            var sendToClients = true;
            msg = JSON.parse(message.utf8Data);
            var connect = getConnectionForID(msg.id);

            switch (msg.type)
            {
                case "message":
                    msg.name = connect.username;
                    msg.text = msg.text.replace(/(<([^>]+)>)/ig, "");
                    break;

                case "username":
                    var nameChanged = false;
                    var origName = msg.name;

                    while (!isUsernameUnique(msg.name))
                    {
                        msg.name = origName + appendToMakeUnique;
                        appendToMakeUnique++;
                        nameChanged = true;
                    }

                    if (nameChanged)
                    {
                        var changeMsg = {
                            id: msg.id,
                            type: "rejectusername",
                            name: msg.name
                        };
                        connect.sendUTF(JSON.stringify(changeMsg));
                    }

                    connect.username = msg.name;
                    sendUserListToAll();
                    break;
            }

            if (sendToClients)
            {
                var msgString = JSON.stringify(msg);
                var i;

                for (i = 0; i < connectionArray.length; i++)
                {
                    connectionArray[i].sendUTF(msgString);
                }
            }
        }
    });

    connection.on('close', function (connection)
    {
        connectionArray = connectionArray.filter(function (el, idx, ar)
        {
            return el.connected;
        });
        sendUserListToAll();  // Update the user lists
        console.log((new Date()) + " Peer " + connection.remoteAddress + " disconnected.");
    });
});
