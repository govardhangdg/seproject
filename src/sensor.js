const fs = require('fs');

let data = fs.readFileSync('./r.txt','utf8');
data = data.split('----');
let moistures = JSON.parse(data[0]);
let diff = JSON.parse(data[1]);

let moisture = moistures[0];
let i = 0;

process.on('message', (data) => {
    moisture += data;
});

setInterval(() => {
    console.log(moisture);
    process.send(moisture);
    moisture += diff[i];
    i++;
},4000);
