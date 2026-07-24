// server/server.js

const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "../public")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

const players = {};

io.on("connection", (socket) => {

    console.log("Player Connected:", socket.id);

    players[socket.id] = {
        id: socket.id,
        x: 0,
        y: 5,
        z: 0,
        rotY: 0,
        health: 100,
        weapon: "pistol",
        kills: 0,
        deaths: 0
    };

    socket.emit("currentPlayers", players);

    socket.broadcast.emit("newPlayer", players[socket.id]);

    socket.on("updatePlayer", data => {

        if (!players[socket.id]) return;

        players[socket.id].x = data.x;
        players[socket.id].y = data.y;
        players[socket.id].z = data.z;
        players[socket.id].rotY = data.rotY;

        socket.broadcast.emit("playerMoved", players[socket.id]);
    });

    socket.on("shoot", data => {
        socket.broadcast.emit("playerShoot", {
            id: socket.id,
            ...data
        });
    });

    socket.on("chat", msg => {

        io.emit("chat",{
            id:socket.id,
            message:msg
        });

    });

    socket.on("damage", data=>{

        const target=players[data.target];

        if(!target) return;

        target.health-=data.damage;

        if(target.health<=0){

            target.health=100;

            target.deaths++;

            players[socket.id].kills++;

            io.emit("playerKilled",{
                killer:socket.id,
                victim:data.target
            });

        }

    });

    socket.on("disconnect",()=>{

        delete players[socket.id];

        io.emit("removePlayer",socket.id);

        console.log("Disconnected:",socket.id);

    });

});

server.listen(PORT,()=>{

    console.log("Server Started On Port",PORT);

});
