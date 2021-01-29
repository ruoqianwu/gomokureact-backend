const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const gameLogic = require('./game-logic.js');
const app = express();
const cors = require('cors')

const server = http.createServer(app);
const io = socketio(server);

io.on('connection', client => {
    gameLogic.initializeGame(io, client)
    console.log('on connection')
});



const router = require('./router')
app.use(router)
app.use(cors())


const port = process.env.PORT || 5000
server.listen(port, () => {
    console.log(`listening on PORT ${port}`)
});