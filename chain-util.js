const EC = require('elliptic').ec;  //EC is a class of whole Elliptical cryptographic functions.
const uuidV1 = require('uuid/v1'); //uuid is the universal unique identifier version1 (based on timestamp),gives us the way of creating unique 32 bit keys strings which acts as the transaction id to make out between each of the transaction.
const ec = new EC('secp256k1');  //We essentially make use of only secp256k1, which even bitcoins uses.
//sec :-Standards of Efficient Cryptography => p :- prime => 2  => 256 :- 256 bits of key(prime number)  k:- scientist name(koblis) 1:- First of it's kind in the curve implementtation in the cryptography.

const SHA256 = require('crypto-js/sha256');

class ChainUtil {
  static genKeyPair(){
    return ec.genKeyPair();
  }      //Generates a pair of public and private keys and returns the same

static id(){
  return uuidV1();
}               //Generates and returns the unique identifier for giving the id for the transactions.

static hash(data){
  return SHA256(JSON.stringify(data)).toString();
}                 //Generates the hashcode for the given input of data.

static verifySignature(publicKey, signature, dataHash) {
	return ec.keyFromPublic(publicKey, 'hex').verify(dataHash, signature);
}                     //Verifies whether the signature of the transaction is valid or not. elliptic has in-built function for this.

}

module.exports = ChainUtil;
