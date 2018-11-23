const Wallet = require('../wallet')
const Transaction = require('../wallet/transaction')

class Miner {
  constructor(blockchain, transactionPool, wallet, p2pServer) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
    this.p2pServer = p2pServer;
  }

  mine() {
    const validTransactions = this.transactionPool.validTransactions();
    // include a reward transaction for the miner
    // create a block consisting of the valid transactions
    // synchronize the chains in the peer-to-peer server
    // clear the transaction pool (local to this pool)
    // broadcast to every miner to clear their transaction pools (clearing every transaction pool)
validTransactions.push(
  Transaction.rewardTransaction(this.wallet, Wallet.blockchainWallet());
);
const block = this.blockchain.addBlock(validTransactions);
this.p2pServer.syncChains();

this.transactionPool.clear();
this.p2pServer.broadcastClearTransactions();
return block;
  }
}

module.exports = Miner;
