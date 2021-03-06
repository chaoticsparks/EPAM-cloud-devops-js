#!/usr/bin/env node

/**
 * Module dependencies.
 */

require('dotenv').config();
const app = require('./app/app');
const debug = require('debug')('epam-cloud-devops-js:server');
const https = require('https');
const fs = require('fs');
const path = require('path');

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.APP_PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = https.createServer({
    key: fs.readFileSync(path.join(__dirname, '..', 'cert', 'privkey.pem')), // путь к ключу
    cert: fs.readFileSync(path.join(__dirname, '..', 'cert', 'cert.crt')) // путь к сертификату
},app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

const sigs = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
sigs.forEach((sig) => {
    process.on(sig, () => {
        console.log(`${sig} Closing server`);

        // Stops the server from accepting new connections and finishes existing connections.
        server.close(function (err) {
            if (err) {
                console.error(err);
                process.exit(1);
            }

            console.log(`${sig} Server closed`);
            process.exit(0);
        });
    });
});

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    const addr = server.address();
    const bind =
        typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    debug('Listening on ' + bind);
}
