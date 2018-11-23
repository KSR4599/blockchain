const Wallet = require('./index');
const TransactionPool = require('./transaction-pool');
const Blockchain = require('../blockchain')

describe('Wallet', () => {
  let wallet, tp,bc;

  beforeEach(() => {              //Before each test, a wallet and a new transaction pool is allocated.
    wallet = new Wallet();
    tp = new TransactionPool();
    bc = new Blockchain();
  });

  describe('creating a transaction', () => {
    let transaction, sendAmount, recipient;                       //Here we create a transaction.
    beforeEach(() => {
      sendAmount = 50;
      recipient = 'r4nd0m-4ddr3s';
      transaction = wallet.createTransaction(recipient, sendAmount,bc , tp);
    });

    describe('and doing the same transaction', () => {
      beforeEach(() => {                                        //Again creating the same transaction. So recepient now has the sendMoney*2 to receive.
        wallet.createTransaction(recipient, sendAmount,bc, tp);
      });

      it('doubles the `sendAmount` subtracted from the wallet balance', () => {
        expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
        .toEqual(wallet.balance - sendAmount*2);             //Now transaction.output.amount (the money to be sent to the receiver)
      });

//This test specifies that, the output.amount of this particular transaction must be an array equal to the two elements of the sendMoney.[ Since we have done two transactions of the same money]
      it('clones the `sendAmount` output for the recipient', () => {
        expect(transaction.outputs.filter(output => output.address === recipient)
          .map(output => output.amount)).toEqual([sendAmount, sendAmount]);
      });
    });
  });

  describe('calculating a balance',() => {
    let addBalance, repeatAdd, senderWallet;
    //=====================
  })
});
