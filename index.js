const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { Telnet } = require('telnet-client');
const app = express();
app.use(express.static('public'));
const server = http.createServer(app);
const io = socketIo(server);

const TELNET_HOST = 'connect.vikingmud.org';
const TELNET_PORT = 2001;

io.on('connection', (socket) => {
    console.log('New client connected');
    let connection = new Telnet();

    // Configure the telnet connection parameters
    let params = {
        host: TELNET_HOST,
        port: TELNET_PORT,
        negotiationMandatory: false,
        timeout: 60000,
    };

    connection.connect(params)
        .then(() => {
            console.log('Connected to telnet server');
        })
        .catch((error) => {
            console.error('Telnet connection error:', error);
        });

    // Listen for messages from the client
    socket.on('message', (message) => {
        connection.send(message)
            .then((res) => {
                // Send the response from the telnet server back to the client
                socket.emit('telnetData', res);
            })
            .catch((error) => {
                console.error('Telnet send error:', error);
            });
    });

    connection.on('data', (data) => {
        // Send any data received from the telnet server to the client
        socket.emit('telnetData', data.toString());
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
        connection.end();
    });
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});