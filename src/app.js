const express = require('express');
const http = require('http');
const path = require('path');
const {fork} = require('child_process');
const hbs = require('hbs');

let sensor;

const Web3 = require('web3');
const web3 = new Web3('ws://127.0.0.1:7545');

let provider,consumer;

(async() => {
    let accounts = await web3.eth.getAccounts();
    provider = accounts[0];
    consumer = accounts[1];
})();

let sock;


let pay = () => {
    setTimeout(async () => {
        try{
            await service.methods.startWorking().send({from : a.from, value : 4 * 1e18});
            console.log('paid');
        }catch(err){
            console.log(err);
        }
        // s = new web3.eth.Contract(JSON.parse(interface),service.options.address);
        // try{
        //     await s.methods.startWorking().send({from : a, value : 0});
        // }catch (err) {
        //     console.log('pay',err);
        // }
        
    },100);
}

const app = express();
const server = http.Server(app);

const io = require('socket.io')(server);

io.on('connection',(socket) => {

    console.log('connected');

    sock = socket;

    socket.on('disconnect',() => {
        console.log('client disconnected');
    })
});


const {interface, bytecode} = require('../compile');
let service;
let a;
(async () => {
    accounts = await web3.eth.getAccounts();
    try {
        service = await new web3.eth.Contract(JSON.parse(interface))
            .deploy({data : bytecode, arguments : []})
            .send({from : accounts[0],gas : 1000000});
            
            service.events.trackingEvent({
                filter : {active : true}
            },(err,event) => {

            }).on('data',async(event) => {
                console.log('++++++++++++++++++++++++++++');              
                a = await web3.eth.getTransactionReceipt(event.transactionHash);
                let time = (parseInt(event.returnValues.endTrackingTime) * 1000 - (new Date).getTime());
                sensor = fork('./sensor');

                sensor.on('message',async(data) => {
                    if(sock){
                        sock.send(data);
                    }
                    
                    if(data < 30){
                        await pay(); 
                        sensor.send(5);   
                        setTimeout(async() => {
                            console.log('start');
                            await service.methods.stopWorking().send({from : a.from, value : 0});
                            console.log('end');
                        },500);        
                        // setTimeout(() => {
                            
                        //     setTimeout(() => {
                        //         sensor.send(5);
                        //         setTimeout(() => {
                                    
                        //         },100);
                        //     },1000);
                        // }, 2000);
                    }
                });
                
                setTimeout(() => {
                    service.methods.stopTracking().send({from : a.from , value : 0});
                },time);
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

app.get('/graph',(req,res) => {
    console.log('called');
    res.sendFile(path.join(__dirname,'graph.html'));
});

server.listen(8000,() => {
    console.log("listening at port 8000");
});