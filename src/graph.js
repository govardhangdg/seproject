const express = require('express');
const {fork} = require('child_process');
const sensor = fork('sensor.js');
const path = require('path');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

// @TODO create a block in ethereum when watering

app.get('/',(req,res) => {
    res.sendFile(path.join(__dirname,'index.html'));
})

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

app.get('/graph',(req,res) => {
    console.log('called');
    res.sendFile(path.join(__dirname,'graph.html'));
});

http.listen(8000,() => {
    console.log('listening at port 8000');
})
