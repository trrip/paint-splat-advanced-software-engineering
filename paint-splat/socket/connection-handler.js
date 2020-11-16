GROUP_LENGTH = 2;
var localCount = 0;
class ConnectionHandler {
  constructor() {
    this.queueManager = new Queue();
  }

  listen(appServer) {
    const options = {
      /* ... */
    };
    const io = require("socket.io")(appServer, options);

    io.engine.generateId = function (req) {
      // generate a new custom id here
      localCount++;
      return `player${localCount}`;
    };

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
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.round(Math.random() * (max - min + 1)) + min;
}

class GameSession {
  constructor(members, io) {
    this.uniqueName = members[0].id;

    for (let i of members) {
      i.join(this.uniqueName);
    }
    let randomVel = [1, -1];

    let gameEnd = Date.now() + 100000;
    let startX = getRandomInt(30, 390);
    let startY = getRandomInt(30, 390);
    let speed = getRandomInt(2, 4);

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
        speed: speed,
      },
    });
    io.sockets.in(this.uniqueName).on("gameCom", (socketMessagee) => {
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
  constructor() {
    this.waitingMembersQueue = []; //members that are waiting in the queue. //waiting room
    this.gameSessions = [];
  }

  addMemberToQueue(socketMember, io) {
    this.waitingMembersQueue.push(socketMember);

    if (this.waitingMembersQueue.length == GROUP_LENGTH) {
      this.gameSessions.push(
        new GameSession([...this.waitingMembersQueue], io)
      );

      this.waitingMembersQueue = [];
    }
  }
}
var handler = new ConnectionHandler();
module.exports = handler;
