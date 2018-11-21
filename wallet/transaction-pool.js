//Purpose is that, we need to store all the incoming transactions from various peers in the group called transaction pool, before they get validated and updated to the block chain by the miners.
//So, in here, we will make use of updateOrAddTransaction() to get the transactions into our transaction pool.

class TransactionPool {
  constructor() {
    this.transactions = [];
  }
//Since we were using that update transaction method, which is meant to add up the outputs to the same input. Here we need to take care that multiple transactions with same input doesnt exist with the different outputs.
//Since the implmentation of update method, the new transaction with the same input come in the cumulative sum of the outputs.
  updateOrAddTransaction(transaction) {
//Checking if transaction id already exists in the pool, if exists new transaction will be replaced with the found transaction.
    let transactionWithId = this.transactions.find(t => t.id === transaction.id);
    if (transactionWithId) {
      this.transactions[this.transactions.indexOf(transactionWithId)] = transaction;
    } else {
//else , transaction will be considered as new and pushed into transactions pool.
      this.transactions.push(transaction);
    }
  }

//returns the transaction based on the input address passed.
  existingTransaction(address){
    return this.transactions.find(t => t.input.address === address);
  }

//Valid Transactions method returns all of the transactions in the transaction array with in this pool that satisfy the following conditions:-
//1.) It's total output amount matches with the original balance specified in the input amount
//2.) Verifies the signature of every transaction to counterfeit the corrupted transactions.

  validTransactions() {
  return this.transactions.filter(transaction => {
    const outputTotal = transaction.outputs.reduce((total, output) => {
      return total + output.amount;
    }, 0);

    if (transaction.input.amount !== outputTotal) {
      console.log(`Invalid transaction from ${transaction.input.address}.`);
      return;
    }

    if (!Transaction.verifyTransaction(transaction)) {
      console.log(`Invalid signature from ${transaction.input.address}.`)
      return;
    };

    return transaction;
  });
}
}

module.exports = TransactionPool;
