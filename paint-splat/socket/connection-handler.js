GROUP_LENGTH = 4;
var localCount = 0;
class ConnectionHandler {
  constructor() {
    this.queueManager = new Queue();
  }

  listen(appServer) {
    const io = require("socket.io")(appServer, {});

    io.engine.generateId = function (req) {
      localCount++;
      return `player_${localCount}`;
    };

    io.on("connection", (socket) => {
      this.queueManager.addMemberToQueue(socket, io);
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

function randomNumber(min, max) {
  return (
    Math.round(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) +
    Math.ceil(min)
  );
}

class GameSession {
  constructor(members, io) {
    this.uniqueName = members[0].id;

    for (let i of members) {
      i.join(this.uniqueName);
    }
    let gameEnd = Date.now() + 20000;
    let startX = randomNumber(30, 390);
    let startY = randomNumber(30, 390);
    let speed = randomNumber(2, 4);

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
