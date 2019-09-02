/* IMPORTS */
let zmq = require('zeromq');
let uniqid = require('uniqid');

/* READLINE INTERFACE */
let readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

/* CMD ARGUMENTS */
const args = require('minimist')(process.argv.slice(2));

/* ZMQ CONNECTION */

const pubSocket = zmq.socket('pub', null);

let pubSocketTCP = `tcp://127.0.0.1:${args['sub']}`;

pubSocket.connect(pubSocketTCP);

const subSocket = zmq.socket('sub', null);

let subSocketTCP = `tcp://127.0.0.1:${args['pub']}`;

subSocket.connect(subSocketTCP);

/* RESPONSE VARIABLES */

let api_in = 'api_in';
let secondFrame = {
    type: 'login',
    email: '',
    pwd: '',
    msg_id: uniqid()
}
//Readline implementation
readline.question('What is your email? \n', (email) => {
    secondFrame.email = email;
    readline.question('What is your password \n', (pwd) => {
        secondFrame.pwd = pwd;
        let msg = api_in + JSON.stringify(secondFrame);
        console.log(msg);
        pubSocket.send(msg);
    });
});
// Subscription
subSocket.subscribe('api_out');
// Getting response from the server
subSocket.on('message', (response) => {
    let res = response.toString().replace('api_out', '');
    let responseParsed = JSON.parse(res);
    if(responseParsed.status == 'error') {
        console.log(responseParsed.error)
    } else {
        console.log(responseParsed.status)
    };
}); 