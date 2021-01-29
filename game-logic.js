var io
var gameSocket
var gamesInSession = []

const initializeGame = (sio, socket) => {
    io = sio
    gameSocket = socket
    gamesInSession.push(gameSocket)

    gameSocket.on('createNewGame', createNewGame);
    gameSocket.on('disconnect', onDisconnect);
    gameSocket.on('playerJoinGame', playerJoinGame);
    gameSocket.on('request username', requestUsername);
    gameSocket.on('received username', receivedUsername);
    gameSocket.on('new move', newMove);
    gameSocket.on('has winner', openModal);
}

function createNewGame(gameID) {
    this.emit('createNewGame', {gameID: gameID, mySocketID: this.id});
    this.join(gameID)
}

function onDisconnect() {
    var index = gamesInSession.indexOf(gameSocket);
    gamesInSession.splice(index, 1)
}

function playerJoinGame(idData) {
    var socket = this;
    var room = io.sockets.adapter.rooms[idData.gameID];
    console.log(idData.username + ''+ {room})
    
    if (room===undefined){
        this.emit('status', 'The game session does not exist');
        return;
    }
    if (room.length<2){
        idData.mySocketID = socket.id;
        socket.join(idData.gameID);

        if (room.length===2){
            io.sockets.in(idData.gameID).emit('start game', idData.username);
        }
        io.sockets.in(idData.gameID).emit('playerJoinedRoom', idData);
        console.log(io.sockets.adapter.rooms)
        console.log(room.length)
        return
    } else {
        this.emit('status', 'There are already 2 players in the room.')
    }
}

function requestUsername(gameID) {
    io.to(gameID).emit('give username', this.id);
}

function receivedUsername(data) {
    data.socketID = this.id;
    io.to(data.gameID).emit('get opponent username', data);
}

function newMove(move) {
    const gameID = move.gameID;
    io.to(gameID).emit('opponent move', move);
}

function openModal(data) {
    io.to(data.gameID).emit('open modal', data.winner);
}

exports.initializeGame = initializeGame;