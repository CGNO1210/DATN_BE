import express from 'express';
import http from 'http'
import bodyParser from 'body-parser';
// import configViewEngine from './config/viewEngine';
import initWebRoutes from './routes/web';
import cors from 'cors';
import connectDB from './config/connectDB'
const socketIO = require('socket.io');
import db from './models/index';

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
// let connectedSockets = []
io.on('connection', (socket) => {

    socket.on('test', (data) => {
        socket.to(data.socketId).emit('ontest', data.socketId)
    })
    console.log('Người ' + socket.id + ' đã kết nối');

    socket.on('joinRoom', room => {
        socket.join(room);
        io.to(room).emit('message', 'A new user has joined the room');
    });
    //sett onl
    // Lắng nghe sự kiện từ client
    socket.on('init', async (id) => {
        // socket.nameUser = data.nameUser
        if (id) {
            socket.idUser = id
            //set onl in db
            await db.User.update({
                isOnline: 1,
                socketId: socket.id
            }, {
                where: { id: id }
            }).then(() => {
                console.log('id: ', id,);
                io.emit('online', `${id} online`);
            }).catch(err => console.log(err))
        }
        socket.on('delete', (data) => {
            io.emit('online', data);
        })

        //set socketId in db
        // io.emit('all users', getSocketIds());
    })
    socket.on('send message', ({ room, idSend, idReceive, isGroup, message, type, socketId }) => {

        if (!isGroup) {
            if (socketId) {
                socket.to(socketId).emit('receive message', { idSend, idReceive, isGroup, message, type })
                // socket.broadcast.emit('user receive message', { message, userName })
            }
        } else {
            io.to(room).emit('receive message group', { idSend, idReceive, isGroup, message, type })
        }
    })

    socket.on('chat to', (id) => {
        socket.chat = id
    })

    // Xử lý sự kiện khi có người ngắt kết nối
    socket.on('disconnect', async () => {
        // connectedSockets = connectedSockets.filter((s) => s.id !== socket.id);
        // io.emit('all users', getSocketIds());
        console.log('Người dùng đã ngắt kết nối');
        //set off
        if (socket.idUser) {
            await db.User.update({
                isOnline: 0,
                socketId: ''
            }, {
                where: { id: socket.idUser }
            })
        }
        io.emit('online', `offline`);
    });
});

//routes
connectDB()
initWebRoutes(app)

//listen
let port = process.env.PORT
server.listen(port, () => {
    console.log(`Backend nodejs is running on the port: http://localhost:${port}`);
})
// setupSocketIO(io)
