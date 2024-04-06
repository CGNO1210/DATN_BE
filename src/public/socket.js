if (!sessionStorage.getItem('name')) {
    window.location.href = '/login'
}
else {
    const baseUrl = 'http://localhost:3001';
    let socket = io()
    socket.emit('set name', { nameUser: sessionStorage.getItem('name'), id: sessionStorage.getItem('id'), avatar: sessionStorage.getItem('avatar') })
    const btn = document.querySelector("#btn")
    const chat = document.querySelector(".chat");
    const chatbox = document.querySelector(".chatbox");
    const usersOnlineBlock = document.querySelector(".room_chat")
    const usersOfflineBlock = document.querySelector(".offline")
    const nameChat = document.querySelector(".nameChat")
    const avatar = document.querySelector(".left_footer img")
    avatar.src = sessionStorage.getItem('avatar')
    let id_receive = ''
    document.querySelector(".left_user").innerHTML = sessionStorage.getItem('name')
    //Lấy ra tất cả những người đang online
    socket.on('all users', async (data) => {
        console.log('#############')
        //user online
        console.log(data)
        console.log('*************')
        //all Users
        let allUsers = await getAllUser()
        console.log(allUsers.users)
        //user off line
        var offlineUser = allUsers.users.filter(function (userB) {
            return !data.some(function (userA) {
                return userA.idUser == userB.id;
            });
        });
        console.log('$$$$$$$$$$$$$')
        console.log(offlineUser)
        //trừ bỏ đi người dùng hiện tại
        data = data.filter((s) => s.id !== socket.id);
        usersOnlineBlock.innerHTML = ''
        data.forEach((item) => {
            let newElement = document.createElement("div");
            newElement.classList.add("user");

            let avatarElement = document.createElement('img')
            avatarElement.src = item.avatar
            let userNameElement = document.createElement('div')
            userNameElement.classList.add("username")
            userNameElement.innerHTML = item.userName

            let hiddenInputId = document.createElement("input");
            hiddenInputId.classList.add('hiddenInputId')
            hiddenInputId.type = "hidden";
            hiddenInputId.value = item.id

            //id người nhận lưu trong db
            let hiddenInputIdUser = document.createElement("input");
            hiddenInputIdUser.classList.add('hiddenInputIdUser')
            hiddenInputIdUser.type = "hidden";
            hiddenInputIdUser.value = item.idUser
            newElement.appendChild(avatarElement)
            newElement.appendChild(userNameElement)
            newElement.appendChild(hiddenInputId)
            newElement.appendChild(hiddenInputIdUser)
            usersOnlineBlock.appendChild(newElement)
        })
        //offline

        usersOfflineBlock.innerHTML = ''
        offlineUser.forEach((item) => {
            let newElement = document.createElement("div");
            newElement.classList.add("user");

            let avatarElement = document.createElement('img')
            avatarElement.src = item.avatar
            let userNameElement = document.createElement('div')
            userNameElement.classList.add("username")
            userNameElement.innerHTML = item.nameUser

            let hiddenInputId = document.createElement("input");
            hiddenInputId.classList.add('hiddenInputId')
            hiddenInputId.type = "hidden";
            hiddenInputId.value = item.id

            //id người nhận lưu trong db
            let hiddenInputIdUser = document.createElement("input");
            hiddenInputIdUser.classList.add('hiddenInputIdUser')
            hiddenInputIdUser.type = "hidden";
            hiddenInputIdUser.value = item.id
            newElement.appendChild(avatarElement)
            newElement.appendChild(userNameElement)
            newElement.appendChild(hiddenInputId)
            newElement.appendChild(hiddenInputIdUser)
            usersOfflineBlock.appendChild(newElement)
        })
        //onclick vào user để hiện đoạn chat
        document.querySelectorAll(".user").forEach((item) => {
            item.onclick = async () => {
                let right = document.querySelector('.right')
                let choose_chat = document.querySelector('.choose_chat')
                if (right.classList.contains('none')) {
                    right.classList.remove('none')
                }
                if (!choose_chat.classList.contains('none')) {
                    choose_chat.classList.add('none')
                }

                chatbox.innerHTML = ''
                let my_id = sessionStorage.getItem('id')
                nameChat.innerHTML = item.innerHTML
                let id = item.querySelector('.hiddenInputId').value || 0
                id_receive = item.querySelector('.hiddenInputIdUser').value
                //các tin nhắn của 2 người trong đoạn chat
                let historyMessages = await loadHistoryMessages(my_id, id_receive)
                console.log(historyMessages)
                historyMessages.messages.forEach((item) => {
                    let newElement = document.createElement("div");
                    newElement.classList.add("block");
                    if (item.idSend == my_id) {
                        newElement.classList.add("send");
                    } else {
                        newElement.classList.add("receive")
                    }

                    let messageElement = document.createElement("div")
                    messageElement.classList.add("message")
                    let userChat = item.idSend == my_id ? sessionStorage.getItem('name') : nameChat.innerHTML
                    messageElement.innerHTML = item.content

                    let userMessageElement = document.createElement('input')
                    userMessageElement.classList.add('user_message')
                    userMessageElement.value = userChat
                    userMessageElement.type = "hidden"
                    newElement.appendChild(messageElement);
                    newElement.appendChild(userMessageElement);
                    chatbox.appendChild(newElement)
                })
                if (id) {
                    socket.emit('chat to', id)
                }

            }
        })
    })
    //nhận tin nhắn
    socket.on('user receive message', (data) => {
        let newElement = document.createElement("div");
        newElement.classList.add("block");
        newElement.classList.add("receive");

        let messageElement = document.createElement("div")
        messageElement.classList.add("message")
        messageElement.innerHTML = data.message

        let userMessageElement = document.createElement('input')
        userMessageElement.classList.add('user_message')
        userMessageElement.value = data.userName
        userMessageElement.type = "hidden"

        newElement.appendChild(messageElement)
        newElement.appendChild(userMessageElement)

        // chatbox.appendChild(newElement)
        chatbox.insertBefore(newElement, chatbox.firstChild);
    })

    //gửi tin nhắn
    btn.onclick = async () => {
        let newElement = document.createElement("div");
        newElement.classList.add("block");
        newElement.classList.add("send");

        let messageElement = document.createElement("div")
        messageElement.classList.add("message")
        messageElement.innerHTML = chat.value;

        let userMessageElement = document.createElement('input')
        userMessageElement.classList.add('user_message')
        userMessageElement.value = sessionStorage.getItem('name')
        userMessageElement.type = "hidden"
        newElement.appendChild(messageElement);
        newElement.appendChild(userMessageElement);

        // chatbox.appendChild(newElement)
        chatbox.insertBefore(newElement, chatbox.firstChild);

        await createMessage(sessionStorage.getItem('id'), chat.value, id_receive)
        socket.emit('user send message', chat.value)
        chat.value = ''
    }
    document.querySelector('.chat').onkeydown = (event) => {
        if (event.key === 'Enter') {
            // Thực hiện hành động khi nhấn Enter (ví dụ: gửi tin nhắn)
            btn.click()
        }
    }

    let createMessage = async (idSend, content, idReceive) => {
        let data = await fetch(`${baseUrl}/api/createMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Kiểu dữ liệu của dữ liệu bạn gửi đi
                // Add any other headers as needed
            },
            body: JSON.stringify({
                idSend,
                content,
                idReceive
            }) // Chuyển đối tượng thành chuỗi JSON
        })
            .then(response => response.json())
            .then(data => data)
            .catch(error => {
                console.error('Error fetching data:', error);
            });
        return data
    }
    let loadHistoryMessages = async (user1, user2) => {
        let data = await fetch(`${baseUrl}/api/getMessages?user1=${user1}&user2=${user2}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json' // Kiểu dữ liệu của dữ liệu bạn gửi đi
                // Add any other headers as needed
            },
        })
            .then(response => response.json())
            .then(data => data)
            .catch(error => {
                console.error('Error fetching data:', error);
            });
        return data
    }
    const btn_logout = document.querySelector('.btn_logout')
    btn_logout.onclick = (e) => {
        socket.disconnect()
        window.location.href = "/login"
    }
    let getAllUser = async () => {
        let data = await fetch(`${baseUrl}/api/getAllUser?id=ALL`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json' // Kiểu dữ liệu của dữ liệu bạn gửi đi
                // Add any other headers as needed
            },
        })
            .then(response => response.json())
            .then(data => data)
            .catch(error => {
                console.error('Error fetching data:', error);
            });
        return data
    }


}