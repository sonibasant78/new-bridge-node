const http = require("http");
const app = require("./app");
var server = http.createServer(app);
const port = 9000;
var cors = require("cors");
app.use(cors());

// const io = require("socket.io")(server, {
//     path: "/bridge/test",
// });

const io = require("socket.io")(server);

//server started
server.listen(port, (req, res) =>
    console.log("Bridge server started at port " + port)
);

let users = [];

//add user connected with the socket
const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
        users.push({ userId, socketId });
};

//remove user from users array after disconnecting
const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
    console.log("userId ", userId)
    return users.find((user) => user.userId === userId);
};

// socket connection setup
io.on("connection", (socket) => {
    console.log(`======socket connected ${new Date()}======`);

    //getting socket connection
    socket.on("addUser", (userId) => {
        console.log("socket addUser event fired", userId);
        addUser(userId, socket.id);
        io.emit("getUsers", users);
    });

    //send message and recieve message
    socket.on("sendMessage", (data) => {
        console.log("socket send message data", data);
        const user = getUser(data.recieverId);
        console.log("user found ", user);
        socket.broadcast.to(user.socketId).emit("getMessage", {
            recieverMessage: data.recieverMessage,
            recieverImage: data.recieverImage,
            recieverName: data.recieverName,
            message_id: data.message_id,
            reaction_emoji_unicodes: data.reaction_emoji_unicodes,
            messagedAt: data.messagedAt,
            senderId: data.senderId,
        });
    });

    // add reaction to message   
    socket.on("addReaction", (data) => {
        console.log("addReaction socket data", data);

        const user = getUser(data.recieverId);
        console.log("user ", user);

        if (user)
            socket.broadcast.to(user.socketId).emit("receiveAddedReaction", data);
    })

    //when disconnect
    socket.on("disconnect", () => {
        console.log("socket disconnected");
        io.emit("message", "user left the room");
        removeUser(socket.id);
        io.emit("getUsersremovehonekebaad", users);
    });
});