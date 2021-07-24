const process = require('process')
const io = require('socket.io')(process.env.PORT || 8888)

// The client side should have ATLEAST one variable (ID) to send over to the server.
// Connections between two clients can be done via the emission of ID to the server.


// Keeps a list of all concurrent users.
connectedUsers = new Array();

// Function to acquire the index of the user's object in connectedUsers given SocketID.
const getIndexFromSocketID = (requestID) => {
    for (let i = 0; i < connectedUsers.length; i++){
        if (connectedUsers[i].SocketID === requestID) return i;
    }
    return null;
}

// Function to acquire the index of the user's object in connectedUsers given clientID.
const getIndexFromClient = (requestClientID) => {
    for (let i = 0; i < connectedUsers.length; i++){
        if (connectedUsers[i].clientID === requestClientID) return i;
    }
    return null;
}
// Set up instructions for when the server receives a connection.
io.on('connection', (socket) => {

    // Allows the server to log the error message instead of crashing.
    socket.on('connect_error', (err) => {
        console.log(`Connection Error: ${err.message}`)
    });

    // This has to be run in order to utilize the connectedUsers list. The client will be emitting the event.
    socket.on('clientConnected', (clientID) => {
        connectedUsers.push({clientID:clientID, socketID: socket.id, peerID : null})
    })
    
    // Changes the client's peerID to be the requested one. Retains null if requested ID is not found.
    socket.on('connectToUser', (userID) => {
        let clientSocketIndex = getIndexFromSocketID(socket.id);
        let userSocketIndex = getIndexFromClient(userID);
        if (!(clientSocketIndex == null || userSocketIndex == null)){
            connectedUsers[clientSocketIndex].peerID = connectedUsers[userSocketIndex].socketID
        }
    })




})

