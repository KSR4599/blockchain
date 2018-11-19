const ChainUtil = require('../chain-util');

class Transaction {
  constructor() {
    this.id = ChainUtil.id();  //Transaction id inorder to identify each transaction in the transaction object collections.
    this.input = null;       //Input field specifies the information regarding the sender of the transaction 1.) Timestamp 2.)Amount 3.)address 4.)Signature
    this.outputs = [];      //Output field has 2 details 1.)Senders amount(remaining balance) and address(public key) after transaction
  }                                                    //2.)Recepients amount received  and address



//Update Transaction method comes handy whenever we want to merge more than one transaction under the same input if they are from the same wallet, as the input field can be relatively same and dont need be updated for each and every transaction but also can get updated once after numerous transactions.
//Simple words:- We are adding the output to the existing transaction
  update(senderWallet, recipient, amount) {
  	const senderOutput = this.outputs.find(output => output.address === senderWallet.publicKey);

//Assumption :- Redundant Code
    if (amount > senderOutput.amount) {
      console.log(`Amount: ${amount} exceeds balance.`);
      return;
    }



    senderOutput.amount = senderOutput.amount - amount;
    this.outputs.push({ amount, address: recipient });
    Transaction.signTransaction(this, senderWallet);

    return this;
  }


  static newTransaction(senderWallet, recipient, amount) {
    if (amount > senderWallet.balance) {
      console.log(`Amount: ${amount} exceeds balance.`);
      return;
    }

    const transaction = new this();  //this() refers to the constructor of this transaction class

    transaction.outputs.push(...[
      { amount: senderWallet.balance - amount, address: senderWallet.publicKey }, //Senders amount and address after transaction
      { amount, address: recipient }                                             //Recepients amount received  and address
    ]);
    Transaction.signTransaction(transaction, senderWallet);

    return transaction;
  }


  static signTransaction(transaction, senderWallet){
    transaction.input = {
    timestamp: Date.now(),
    amount: senderWallet.balance,
    address: senderWallet.publicKey,
    signature: senderWallet.sign(ChainUtil.hash(transaction.outputs))
  };
}

//Here the signature of the transaction is verified by calling the verifySignature function which is presetn in the ChainUtil with the required parameters.
//The arguments the function take are 3:- 1.) Public key(address) 2.)Actual Signature we need to verify 3.) Data we went to verify in the hashed format (Since Signatures are signed upon the hashed format of the data)
static verifyTransaction(transaction) {
	return ChainUtil.verifySignature(
		transaction.input.address,
    transaction.input.signature,
    ChainUtil.hash(transaction.outputs)
  );
}

}

module.exports = Transaction;
