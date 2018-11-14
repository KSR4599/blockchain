const { INITIAL_BALANCE } = require('../config');
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
}

module.exports = Wallet;
