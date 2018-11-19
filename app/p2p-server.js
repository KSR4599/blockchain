const Websocket = require('ws');

const P2P_PORT = process.env.P2P_PORT || 5001;

//This is the example of connecting with all custom options
// HTTP_PORT = 3002 P2P_PORT=5003 PEERS =ws://localhost:5001,ws://localhost:5002 npm run dev
//So inside of our peers we want to store all the peers websocket address separated by , (commas) else set it to empty array
const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];
const MESSAGE_TYPES = {
  chain : 'CHAIN',
  transaction : 'TRANSACTION'
}

//This is p2pserver class, which takes the default argument of blockchain
class P2pServer {
  constructor(blockchain, transactionPool) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.sockets = [];
  }
//Now we need to listen to the event of 'connection' i.e upon the connection of a new Websocket
//as a result, upon connction, we are calling a callback function which fires the connectSocket function.
//socket is the resultant we got from our 'connection' event and we are passing the same to our callback so add to the sockets array.
  listen() {
    const server = new Websocket.Server({ port: P2P_PORT });
    server.on('connection', socket => this.connectSocket(socket));

//This connectToPeers function is meant to connect to all the peers existing in the peers array.
   this.connectToPeers();

    console.log(`Listening for peer-peer connections on ${P2P_PORT}`);
  }

connectToPeers(){
  peers.forEach(peer => {   //referencing each element of peers array as a 'peer'. Each of these peers looks something like ws://localhost:5001
      const socket = new Websocket(peer);  // We are declaring a new constant named socket which holds the data of the peer in format of WebSocket

       //Here the intention of 'open' event is that, when we specify the peers for our application, we might not have necessarily started the websocket server on the
       //localhost:5001 if theres a peer. But by using socket.on('open'), we can run some code, even if that server has started later, even though we specified this as a peer first.

        socket.on('open',()=> this.connectSocket(socket));
  })
}


//The main intention of this connectSocket fucntion is that, it pushes the new socket into the sockets array.
//So all in all, any new socket must be pushed into the sockets array.
  connectSocket(socket) {
    this.sockets.push(socket);
    console.log('Socket connected');
    this.messageHandler(socket);
    this.sendChain(socket);
  }

//This function is fired when the sendChain() is called. Here this function takes the new socket as the input and parses it into the json format, and replaces
  messageHandler(socket) {            //the current blockchain with the new one.(replaceChain() takes care of the verifications required).(here only current socket or current block chain gets updated)
	socket.on('message', message => {
    const data = JSON.parse(message);
    switch(data.type) {
        case MESSAGE_TYPES.chain:
          this.blockchain.replaceChain(data.chain);
          break;
        case MESSAGE_TYPES.transaction:
          this.transactionPool.updateOrAddTransaction(data.transaction);
          break;
      }
  });
}

sendChain(socket) {
	socket.send(JSON.stringify({
    type: MESSAGE_TYPES.chain,
    chain: this.blockchain.chain
  }));
}

sendTransaction(socket, transaction) {
socket.send(JSON.stringify({
  type: MESSAGE_TYPES.transaction,
  transaction: transaction
}));
}

//The intention of this function is to send the updated chain to all the other peers in the network, so that they can get updated too. We will make us eof the same phenemenon as that of the above.
//The sendChain for each scoket is called and that indeed fires up the messagehandler, which replaces the current chain of each socket with the current instance of the chain.
syncChains() {

    this.sockets.forEach(socket => this.sendChain(socket));   //This line means that to send current servers socket chain, to each one of its sockets. So they can get updated.
}

broadcastTransaction(transaction) {
  	this.sockets.forEach(socket => this.sendTransaction(socket, transaction));
}



}

module.exports = P2pServer;
