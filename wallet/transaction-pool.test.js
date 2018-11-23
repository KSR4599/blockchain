const TransactionPool = require('./transaction-pool');
const Transaction = require('./transaction');
const Wallet = require('./index');
const Blockchain = require('../blockchain');

describe('TransactionPool', () => {
  let tp, wallet, transaction;
  beforeEach(() => {
    tp = new TransactionPool();      //Creation of a wallet and making a transaction and updating or adding up it to the transaction pool
    wallet = new Wallet();
    bc = new Blockchain();
    transaction = wallet.createTransaction('r4nd-$dr355',30,bc,tp);
  });

  it('adds a transaction to the pool', () => {   //Checking whether the above transaction has been added upto the transaction pool in the first place.
    expect(tp.transactions.find(t => t.id === transaction.id)).toEqual(transaction);
  });

  it('updates a transaction in the pool', () => {    //In here, we are attempting to do a new transaction from the same wallet and checking whether the transaction in the transaction pool has been updated or not.
    const oldTransaction = JSON.stringify(transaction);
    const newTransaction = transaction.update(wallet, 'foo-4ddr355', 40);
    tp.updateOrAddTransaction(newTransaction);
    expect(JSON.stringify(tp.transactions.find(t => t.id === newTransaction.id)))
      .not.toEqual(oldTransaction);
  });

  it('clears transactions',()=>){
    tp.clear();
    expect(tp.transactions).toEqual([]);
  }

  describe('mixing valid and corrupt transactions', () => {
  let validTransactions;
  beforeEach(() => {
    validTransactions = [...tp.transactions];
    for (let i=0; i<6; i++) {
      wallet = new Wallet();
      transaction = wallet.createTransaction('r4nd-4dr355', 30, bc, tp);
      if (i%2==0) {
        transaction.input.amount = 9999;
      } else {
        validTransactions.push(transaction);
      }
    }
  });

  it('shows a difference between valid and corrupt transactions', () => {
    expect(JSON.stringify(tp.transactions)).not.toEqual(JSON.stringify(validTransactions));
  });

  it('grabs valid transactions', () => {
    expect(tp.validTransactions()).toEqual(validTransactions);
  });
});
});
