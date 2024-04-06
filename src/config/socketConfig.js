
function setupSocketIO(io) {
    io.on('connection', (socket) => {
        console.log('Người ' + socket.id + ' đã kết nối');

        // Lắng nghe sự kiện từ client
        socket.on('chat message', (message) => {
            console.log(`Nhận tin nhắn: ${message}`);

            // Gửi tin nhắn đến tất cả các client
            io.emit('chat message', message);
        });

        // Xử lý sự kiện khi có người ngắt kết nối
        socket.on('disconnect', () => {
            console.log('Người dùng đã ngắt kết nối');
        });
    });
}

export default setupSocketIO
