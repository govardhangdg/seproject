const Web3 = require('web3');
const web3 = new Web3('http://127.0.0.1:7545');

const {interface, bytecode} = require('./compile');

let service;

(async () => {
    accounts = await web3.eth.getAccounts();
    try {
        service = await new web3.eth.Contract(JSON.parse(interface))
            .deploy({data : bytecode, arguments : []})
            .send({from : accounts[0],gas : 1000000});
            module.exports = {service};
            console.log('transferred');
    } catch(err){
        console.log(err);
    }  
})();
