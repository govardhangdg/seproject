const fs = require('fs');
const path = require('path');
const solc = require('solc');

let pathToContract = path.join(__dirname,'contracts','Service.sol');
let contract = fs.readFileSync(pathToContract,'utf8');

module.exports = solc.compile(contract,1).contracts[':Service'];