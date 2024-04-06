import express from 'express';
import http from 'http'
import bodyParser from 'body-parser';
// import configViewEngine from './config/viewEngine';
import initWebRoutes from './routes/web';
// import setupSocketIO from './config/socketConfig';
import cors from 'cors';
import connectDB from './config/connectDB'
const socketIO = require('socket.io');

require('dotenv').config();

//define app
let app = express();
app.use(cors({ origin: true }))

let server = http.createServer(app)
const io = socketIO(server)
//config app
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("./src/public"))
app.set("view engine", "ejs")
app.set("views", "./src/views")
// configViewEngine(app)
//socket config
let connectedSockets = []
io.on('connection', (socket) => {
    console.log('Người ' + socket.id + ' đã kết nối');
    socket.chat = 'all'
    // Lắng nghe sự kiện từ client
    socket.on('set name', (data) => {
        socket.userName = data.nameUser
        socket.idUser = data.id
        socket.avatar = data.avatar
        connectedSockets.push(socket)
        io.emit('all users', getSocketIds());
    })
    socket.on('user send message', (message) => {
        let userName = socket.userName;
        if (socket.chat === 'all') {
            socket.broadcast.emit('user receive message', { message, userName })
        } else {
            socket.to(socket.chat).emit('user receive message', { message, userName })
        }
    })

    socket.on('chat to', (id) => {
        socket.chat = id
    })

    // Xử lý sự kiện khi có người ngắt kết nối
    socket.on('disconnect', () => {
        connectedSockets = connectedSockets.filter((s) => s.id !== socket.id);
        io.emit('all users', getSocketIds());
        console.log('Người dùng đã ngắt kết nối');
    });
});
function getSocketIds() {
    return connectedSockets.map((socket) => {
        return { id: socket.id, idUser: socket.idUser ,userName:socket.userName, avatar:socket.avatar}
    });
}
//routes
connectDB()
initWebRoutes(app)

//listen
let port = process.env.PORT
server.listen(port, () => {
    console.log(`Backend nodejs is running on the port: http://localhost:${port}`);
})
// setupSocketIO(io)
