require('dotenv').config();


declare var require: any;

const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);

import {Server} from 'socket.io';

const io = new Server(server,{
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

type Point = {
    x: number,
    y: number
}
type DrawLine = {
    prevPoint: Point| null,
    currentPoint: Point,
    color: string
    lineWidth: number
}

io.on("connection", (socket: any) => {
    console.log("a user connected");
    socket.on("client-ready", ()=>socket.broadcast.emit("get-canvas-state"));
    
    socket.on("canvas-state", (data: string)=>{
        socket.broadcast.emit("canvas-state-from-server", data);
    });

    socket.on("draw-line", ({prevPoint, currentPoint, color, lineWidth}: DrawLine)=>{
        socket.broadcast.emit("draw-line", {prevPoint, currentPoint, color, lineWidth});
    })

    socket.on("clear", ()=>io.emit("clear"))
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, ()=>{
    console.log("Server running on port: ", PORT);
})