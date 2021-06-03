const app = require("express")();
const server = require("http").createServer(app);
const cors = require("cors");

// Calling the required dependencies (1-3)

const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send('Server is running.');
});

io.on('connection', (socket) => {
    socket.emit('me', socket.id);
    
    socket.on('disconnect', () => {
        socket.broadcast.emit("callended");
    });

    socket.on("calluser", ({ userToCall, signaldata, from, name }) => {
        io.to(userToCall).emit("calluser",{ signal : signalData, from, name });
    });

    socket.on("answercall", (data) => {
        io.to(data.to).emit("callaccepted", data.signal);
    });

});

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`))