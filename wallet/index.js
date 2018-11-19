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
  createTransaction(recipient, amount, transactionPool) {
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
}

module.exports = Wallet;
