require('dotenv').config()

const admin = require('./firebase-admin');
const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const fs = require('fs');
const app = express();
const cors = require('cors');

const SOCKET = '/tmp/firebase_server.socket';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.APP_PORT || 8080;
const host = process.env.APP_HOST || '127.0.0.1';

var whitelist = [
    'http://localhost:4200',
];
var corsOptions = {
    origin: function(origin, callback){
        var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
        callback(null, originIsWhitelisted);
    },
    credentials: true
};

const router = require('./routes');
app.use(cors(corsOptions));
app.use('/', router);
app.listen(port, host);

// fs.stat(SOCKET, function(err) {
//     if (!err) {
//         fs.unlinkSync(SOCKET);
//     }

//     http.createServer(app).listen(SOCKET, function() {
//         fs.chmodSync(SOCKET, '777');
//         console.log('Listening on ' + SOCKET);
//     });
// });

console.log(`Server listening at ${host}:${port}`);
