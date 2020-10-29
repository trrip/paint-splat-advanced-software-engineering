 
GROUP_LENGTH = 2;
 
 class ConnectionHandler{
    constructor(){

        this.queueManager = new Queue();

    }
    listen = (appServer) => {
        
        const options = { /* ... */ };
        const io = require('socket.io')(appServer, options);

            
        io.on('connection', socket => { 
            console.log("New socket urser is connected");

            this.queueManager.addMemberToQueue(socket,io)
                // socket.on([...somevar], ...);

                //
                socket.on('disconnect', () => {
                    console.log('user disconnected');
            });


        socket.on("gameCom", (socketMessage) => {
             let tempChannel = socketMessage.roomId;
            io.sockets.in(tempChannel).emit('gameCom', {roomId : tempChannel , message : "some new edit messgae "});
        })

        }
        );

    }

}






class GameSession {

    constructor(members, io) {
        
        // this.sessionId = "";
        // this.player = [];
        this.uniqueName = members[0].id; 

        for (let i of members){
            //create a unique name here -- 
            i.join(this.uniqueName);
        }
        
        io.sockets.in(this.uniqueName).emit('gameCom', {roomId : this.uniqueName , message : "some messgae "});

        io.sockets.in(this.uniqueName).on("gameCom", (socketMessagee) => {
            console.log("message incoming");
            io.sockets.in(this.uniqueName).emit('gameCom', {roomId : this.uniqueName , message : "message recieved messgae "} );

        });


        

        // io.on("gameCom", (socketMessagee) =>{
        //     console.log("we should be getting this");
        //     // socketMessagee suppose this coordiates
        //     // io.to("someUniqueName").emit("gameCom","new message");
        //     io.sockets.in("someUniqueName").emit("gameCon","messgahe receieved")
        //     // if(valid_coordintes(socketMessagee)) {
        //     //     io.emit("gameCon", `success + coordinates`); // send the coordinates back to render on other screen
        //     // } else {
        //     //     io.emit("gameCon", "you missed");
        //     // }


        // });
        // passing throgh 
        // score 

        // splashes [ location, player]. 
    }
  /*
group of players : max
session id 


*/ }

class Queue {
    // socketId = 0
    constructor(){   
        this.waitingMembersQueue = []; //members that are waiting in the queue. //waiting room 

        this.gameSessions = [];
    }

    removeMemberFromQueue = () =>{}

    addMemberToQueue = (socketMember, io ) =>{
        // we can generate the unique session is and make a game session out of it

        this.waitingMembersQueue.push(socketMember);

        console.log("the player " + socketMember);

        if(this.waitingMembersQueue.length == GROUP_LENGTH){
            console.log("we are making a queue " + this.waitingMembersQueue.length)
            this.gameSessions.push( new GameSession([...this.waitingMembersQueue],io))
            
            this.waitingMembersQueue = []
            console.log("we are making a queue" + this.waitingMembersQueue);

            //create a game session
            
            // add those t game session
            
            // pop them from the queue 

            // start the session.
            

        }
        // else{
        //     // do a loop and find a game session to add them to or look at last one in session list
        //         // pass 
        // }
    }

}
var handler = new  ConnectionHandler();
module.exports =  handler;


