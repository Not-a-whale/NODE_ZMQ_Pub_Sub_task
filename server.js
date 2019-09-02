/* Imports */

let zmq = require('zeromq');

let db = require('./database');

/* Command line arguments */

const args = require('minimist')(process.argv.slice(2));

/* ZMQ connection */

const pubSocket = zmq.socket('pub', null);

// Binding socket on 'pub' argument
pubSocket.bindSync(`tcp://127.0.0.1:${args['pub']}`);

const subSocket = zmq.socket('sub', null);

subSocket.subscribe('api_in');

/* Server functionality */

subSocket.on('message', function(data) {
    // Parsing message from the client
    let message = data.toString().replace(/api_in/g, '');
    let mes = JSON.parse(message);

    // Variables 
    let api_out = 'api_out';

    let errorWrongPWD = 'WRONG_PWD';
    let errorWrongFormat = 'WRONG_FORMAT';

    //If type == login

    if(mes.type == 'login') {

        // db request 

        db.get(`SELECT user_id from users WHERE email = ? and passw = ?`, [mes.email, mes.pwd], function(err, row) {
            if(err) {
                console.log(err);
            } else {
                // User found
                if(row) {
                    let msg = {
                        msg_id: mes.msg_id,
                        user_id: row.user_id,
                        status: 'ok'
                    }

                    let outMessage = api_out + JSON.stringify(msg);

                    console.log(outMessage);
                    pubSocket.send(outMessage);
                    // Closing connection
                    pubSocket.close();
                    subSocket.close();
                } else {
                    //User not found
                    let msg = {
                        msg_id: mes.msg_id,
                        status: 'error',
                        error: mes.email == '' || mes.pwd == '' ?  errorWrongFormat : errorWrongPWD
                    }
                    console.log(msg);

                    let outMessage = api_out + JSON.stringify(msg);

                    pubSocket.send(outMessage);
                    // Closing connection
                    pubSocket.close();
                    subSocket.close();
                }
            }
        });
    }
});

//Binding socket on 'sub'
subSocket.bindSync(`tcp://127.0.0.1:${args['sub']}`);