GROUP_LENGTH = 2;

class ConnectionHandler {
  constructor() {
    this.queueManager = new Queue();
  }
  listen = (appServer) => {
    const options = {
      /* ... */
    };
    const io = require("socket.io")(appServer, options);

    io.on("connection", (socket) => {
      // console.log("New socket urser is connected");

      this.queueManager.addMemberToQueue(socket, io);
      // socket.on([...somevar], ...);

      //
      socket.on("disconnect", () => {
        console.log("user disconnected");
      });

      socket.on("gameCom", (socketMessage) => {
        let tempChannel = socketMessage.roomId;
        io.sockets.in(tempChannel).emit("gameCom", {
          roomId: tempChannel,
          message: socketMessage.message,
        });
      });
    });
  };
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.round(Math.random() * (max - min + 1)) + min;
}

class GameSession {
  constructor(members, io) {
    // this.sessionId = "";
    // this.player = [];
    this.uniqueName = members[0].id;

    for (let i of members) {
      //create a unique name here --
      i.join(this.uniqueName);
    }
    let randomVel = [1, -1];

    // list of coordinates that square will follow
    // keep game start message
    // let coordinates = createRandomStream();
    let gameEnd = Date.now() + 60000;
    let startX = getRandomInt(30, 390);
    let startY = getRandomInt(30, 390);

    let initialVelocityX = Math.random() < 0.5 ? -1 : 1;
    let initialVelocityY = Math.random() < 0.5 ? -1 : 1;
    io.sockets.in(this.uniqueName).emit("gameCom", {
      roomId: this.uniqueName,
      message: {
        status: 200,
        startX: startX,
        startY: startY,
        initialVelX: initialVelocityX,
        initialVelY: initialVelocityY,
        gameEnd: gameEnd,
      },
    });
    io.sockets.in(this.uniqueName).on("gameCom", (socketMessagee) => {
      // console.log("message incoming");
      io.sockets.in(this.uniqueName).emit("gameCom", {
        roomId: this.uniqueName,
        message: socketMessagee.message,
      });
    });

    io.sockets.on("disconnect", () => {
      console.log("user disconnected");
    });
  }
}

class Queue {
  // socketId = 0
  constructor() {
    this.waitingMembersQueue = []; //members that are waiting in the queue. //waiting room
    this.gameSessions = [];
  }

  removeMemberFromQueue = () => {};

  addMemberToQueue = (socketMember, io) => {
    // we can generate the unique session is and make a game session out of it

    this.waitingMembersQueue.push(socketMember);

    if (this.waitingMembersQueue.length == GROUP_LENGTH) {
      // console.log("we are making a queue " + this.waitingMembersQueue.length);
      this.gameSessions.push(
        new GameSession([...this.waitingMembersQueue], io)
      );

      // console.log("starting a new game");

      this.waitingMembersQueue = [];
      //   console.log("e" + this.waitingMembersQueue);
    }
  };
}
var handler = new ConnectionHandler();
module.exports = handler;
