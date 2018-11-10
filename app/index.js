const express = require('express');
const bodyParser = require('body-parser');
const Blockchain = require('../blockchain');    //Automatically the index.js of blockchain folder will be considered here.
const HTTP_PORT = process.env.HTTP_PORT || 3001;  //Setting the port for our expres to listen to
const P2pServer = require('./p2p-server')


const app = express();
const bc = new Blockchain();               //Instantiation of the block chain with genesis block.
const p2pServer = new P2pServer(bc);


app.use(bodyParser.json());   // For handling of the json related post data.

app.get('/blocks', (req, res) => {
	res.json(bc.chain);                     //Upon /blocks, the existing state of the block chain is displayed.
});

app.post('/mine',(req,res) =>{                          //Upon /mine, the data field is grabbed, and added to the existing block chain.
  const block = bc.addBlock(req.body.data);              //and redirected to the get request of /blocks, to view the currents state of block chain after updation.
  console.log(`New block added: ${block.toString()}`);

  p2pServer.syncChains();        // Whenever a new block gets added to the current chain, this synChains gets called with the current chains instance, which in turn makes teh each socket gets updated with the current(this) block chain.

  res.redirect('/blocks');
})

app.listen(HTTP_PORT, () => console.log(`Listening on port: ${HTTP_PORT}`));      //Specifying which port for the express to listen to.
p2pServer.listen();
