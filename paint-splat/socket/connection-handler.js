 class ConnectionHandler{

    listen = (appServer) => {
        
        const options = { /* ... */ };
        const io = require('socket.io')(appServer, options);
        io.on('connection', socket => { 
        console.log("New socket urser is connected");
            socket.on('disconnect', () => {
                console.log('user disconnected');
            });
        socket.on("gameCom", (socketMessage) => {
                console.log(`message is ${socketMessage}`);
                io.emit('gameCom', `message is ${socketMessage}`);
            })
        });

    }

}
var handler = new  ConnectionHandler();
module.exports =  handler;


