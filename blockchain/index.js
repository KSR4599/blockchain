const Block = require('./block');

class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }

//addblock just add the new block with the specified data field by firing up the mine method giving the data as the param.
  addBlock(data) {
    const block = Block.mineBlock(this.chain[this.chain.length-1], data);
    this.chain.push(block);
    return block;
  }


  isValidChain(chain) {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) return false;
    for (let i=1; i<chain.length; i++) {
      const block = chain[i];
      const lastBlock = chain[i-1];
      if (
        block.lastHash !== lastBlock.hash ||
        block.hash !== Block.blockHash(block)    //Hash verification by generating the hash of the current block and checking it with the
                                                  //hash the block currently holds. They need to be the same.
      ) {
        return false;
      }
    }
    return true;
  }
  replaceChain(newChain){
    if(newChain.length<= this.chain.length){
      console.log('Received chain is not longer than the current chain');
       return;
    }else if(!this.isValidChain(newChain)){                         //Replace chain makes sure of two things:-
      console.log('The received chain is not valid ');             //1.)New chain length must be greater than the older newChain
      return;                                                      //2.)Checks whether the new chain is valid or not
    }
    console.log('Replacing blockchain with the new chain');       //Then finally replaces the old chain with the new one.
    this.chain = newChain;
  }

}

module.exports = Blockchain;
