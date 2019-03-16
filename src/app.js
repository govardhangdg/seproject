const express = require('express');
const http = require('http');
const path = require('path');
const {fork} = require('child_process');
const hbs = require('hbs');

const Web3 = require('web3');
const web3 = new Web3('ws://127.0.0.1:7545');

let provider,consumer;

(async() => {
    let accounts = await web3.eth.getAccounts();
    provider = accounts[0];
    consumer = accounts[1];
})();

const app = express();
const server = http.Server(app);

const io = require('socket.io')(server);
io.on('connection',(socket) => {

    console.log('connected');

    sensor.on('message',(data) => {
        socket.send(data);
        if(data < 20){
            setTimeout(() => {
                sensor.send(5);
                setTimeout(() => {
                    sensor.send(5);
                },1000);
            }, 1000);
        }
    });

    socket.on('disconnect',() => {
        console.log('client disconnected');
    })
});

const {interface, bytecode} = require('../compile');
let service;
(async () => {
    accounts = await web3.eth.getAccounts();
    try {
        service = await new web3.eth.Contract(JSON.parse(interface))
            .deploy({data : bytecode, arguments : []})
            .send({from : accounts[0],gas : 1000000});
            service.events.trackingEvent({
                filter : {active : true}
            },(err,event) => {
                console.log(err,event);
            }).on('data',(event) => {
                console(event);
            });
            // console.log('traaaaaaaaaaa',service.events.trackingEvent.toString());
    } catch(err){
        console.log(err);
    }  
})();

app.set('view engine','hbs');

app.get("/",(req,res) => {
    console.log("called main");
    res.render(path.join(__dirname,'index.hbs'),{
        provider,
        smartContract : service.options.address
    });
});

app.get('/abi',(req,res) => {
    console.log('called abi');
    res.send(interface);
});

app.get('/start',(req,res) => {

});

app.get('/graph',(req,res) => {
    console.log('called');
    res.sendFile(path.join(__dirname,'graph.html'));
});

server.listen(8000,() => {
    console.log("listening at port 8000");
});