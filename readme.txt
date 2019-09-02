In order to enable the server, type into the command line"node server.js --http (port) --pub (port) --sub (port)".
In order to connect with a client, type into the command line "node client.js --http (port) --pub (server's --sub port) --sub (server's --pub port)".
After that you can proceed to authentication. (Example users are in the database.js file).

Example: 

Server:
node server.js --http 8080 --pub 701 --sub 702

Client: 
node client.js --http 8080 --pub 702 --sub 701

