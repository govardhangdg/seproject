const Web3 = require('web3');
const ganache = require('ganache-cli');
const web3 = new Web3(ganache.provider());

// console.log(web3);

web3.eth.getAccounts()
    .then(ins => {
        console.log(ins[0]);
    });
