// app.js

const baseUrl = 'http://localhost:3001';

const loginApi = async (email, password) => {
    let data = await fetch(`${baseUrl}/api/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Kiểu dữ liệu của dữ liệu bạn gửi đi
            // Add any other headers as needed
        },
        body: JSON.stringify({
            email,
            password
        }) // Chuyển đối tượng thành chuỗi JSON
    })
        .then(response => response.json())
        .then(data => data)
        .catch(error => {
            console.error('Error fetching data:', error);
        });
    return data
}

// console.log(await loginApi('admin@gmail.com', '1234'))

const btnLogin = document.querySelector("#btnlg")
const nameUser = document.querySelector(".txt_name");
const passwordUser = document.querySelector(".txt_password");
const btn_rgt = document.querySelector(".btn_rgt");
btnLogin.onclick = async (e) => {
    e.preventDefault()
    let data = await loginApi(nameUser.value, passwordUser.value)
    if (data.errCode) {
        alert(data.errMessage)
    } else {
        let userName = data.user.nameUser
        let id = data.user.id
        let avatar = data.user.avatar
        sessionStorage.setItem('name', userName)
        sessionStorage.setItem('id', id)
        sessionStorage.setItem('avatar', avatar)
        window.location.href = '/'
    }
}
btn_rgt.onclick = () => {
    window.location.href = '/register'
}

