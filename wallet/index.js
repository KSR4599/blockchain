const { INITIAL_BALANCE } = require('../config');
const Transaction = require('./transaction');
const ChainUtil = require('../chain-util');


//This is the wallet component.
//Contains Two main components:- 1.) publicKey 2.) Balance in the wallet

class Wallet {
  constructor() {
    this.balance = INITIAL_BALANCE;  //Initial balance before the transaction
    this.keyPair = ChainUtil.genKeyPair(); //Generating a key value pairs of the keys.
    this.publicKey = this.keyPair.getPublic().encode('hex');  //Grabbing the public key from the generated keyPair, and encode it into the hexadecimal format.
  }

  toString() {
    return `Wallet -
    publicKey : ${this.publicKey.toString()}
    balance   : ${this.balance}`
  }  //These two are the important fields that represents the wallet public key and the balance

  sign(dataHash){
    return this.keyPair.sign(dataHash);
  }

//The goal of createTransaction method is to replace the transaction in the pool by the sender with an updated one, if it already exists in the pool (or) to create  a fresh transaction or add it to the pool.
  createTransaction(recipient, amount, blockchain, transactionPool) {
    this.balance = this.calculateBalance(blockchain)
  if (amount > this.balance) {
    console.log(`Amount: ${amount}, exceeds current balance: ${this.balance}`);
    return;
  }

  let transaction = transactionPool.existingTransaction(this.publicKey);
  if (transaction) {
    transaction.update(this, recipient, amount);
  } else {
    transaction = Transaction.newTransaction(this, recipient, amount);
    transactionPool.updateOrAddTransaction(transaction);
  }

  return transaction;
}

//purpose:- firstly grabbed all blockchain ytansactions. Next got transactions only related to current wallet.Than found the one which is most recent from that
//added up amounts to the balance which come only after the most recent transaction.
calculateBalance(blockchain){
  let balance = this.balance;
  let transactions = [];
  blockchain.chain.forEach(block => block.data.forEach(transaction => {
    transactions.push(transaction)
  }))
  const walletInputTs = transactions
      .filter(transaction => transaction.input.address === this.publicKey);
let startTime = 0 ;

if(walletInputTs.length > 0){
    const recentInputT = walletInputTs.reduce(
      (prev, current) => prev.input.timestamp > current.input.timestamp?prev:current

    )
  balance = recentinputT.outputs.find(output => output.address === this.publicKey).amount;
  startTime = recentInputT.input.timestamp;
}

transactions.forEach(transactions => {
  if(transaction.input.timestamp > startTime){
    transaction.outputs.find(output =>){
      if(output.address === this.publickey){
        balance += output.amount;
      }
    }
  }
})
return balance;
}


static blockchainWallet(){
  const blockchainWallet = new this();
  blockchainWallet.address = 'blockchain-wallet';
  return blockchainWallet;
}
}

module.exports = Wallet;
