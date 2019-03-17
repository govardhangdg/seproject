let moisture = 23;

process.on('message', (data) => {
    moisture += data;
});

setInterval(() => {
    console.log(moisture);
    process.send(moisture);
    moisture -= 1;
},4000);