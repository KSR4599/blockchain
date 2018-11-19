const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('../blockchain');    //Automatically the index.js of blockchain folder will be considered here.
const HTTP_PORT = process.env.HTTP_PORT || 3001;  //Setting the port for our expres to listen to
const P2pServer = require('./p2p-server');
const Wallet = require('../wallet');
const TransactionPool = require('../wallet/transaction-pool');

const app = express();
const bc = new Blockchain();               //Instantiation of the block chain with genesis block.
const wallet = new Wallet();              //Creates  an= new wallet with INITIAL_BALANCE, keyPair and the publicKey
const tp = new TransactionPool();         //Creates a transactions array [empty intially]
const p2pServer = new P2pServer(bc, tp);      //Adds this is block to the peer-peer server enabling it to hear it for various events of other peer blocks.


app.use(bodyParser.json());   // For handling of the json related post data.

app.get('/blocks', (req, res) => {
	res.json(bc.chain);                     //Upon /blocks, the existing state of the block chain is displayed.
});

app.post('/mine',(req,res) =>{                          //Upon /mine, the data field is grabbed, and added to the existing block chain.
  const block = bc.addBlock(req.body.data);              //and redirected to the get request of /blocks, to view the currents state of block chain after updation.
  console.log(`New block added: ${block.toString()}`);

  p2pServer.syncChains();        // Whenever a new block gets added to the current chain, this synChains gets called with the current chains instance, which in turn makes teh each socket gets updated with the current(this) block chain.

  res.redirect('/blocks');     // Just to visualize the whole chain after mininig the new block.
})

app.get('/transactions',(req, res) =>{
	res.json(tp.transactions);            //To view all of the transactions of the wallet
})

app.post('/transact', (req, res) =>{
  const { recipient , amount } = req.body;                                 //Meant to perform a transaction. Takes two requisites of recipient and amount from the hard-coded json data.
	const transaction = wallet.createTransaction(recipient, amount, tp);     //Sends the specified amount to the specified recipient from the current wallet. Here createTransaction is fired which creates a new trasaction and add it to the pool or merges with the existing transaction in the pool.
  p2pServer.broadcastTransaction(transaction);                             //Lets all the peers know about this transaction.
	res.redirect('/transactions');                                           //Meant to show all of the transactions performed from the current wallet.
});

app.get('/public-key', (req, res) => {
  res.json({ publicKey: wallet.publicKey });                             //Meant to return the public key (address) of the current wallet.
});

app.listen(HTTP_PORT, () => console.log(`Listening on port: ${HTTP_PORT}`));      //Specifying which port for the express to listen to.
p2pServer.listen();
