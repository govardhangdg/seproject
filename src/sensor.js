let moisture = 40;

process.on('message', (data) => {
    moisture += data;
})

setInterval(() => {
    process.send(moisture);
    // console.log(moisture);
    // @TODO write to a file
    moisture -= 1;
},1000);