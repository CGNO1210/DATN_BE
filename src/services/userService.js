import db from '../models/index';
import bcrypt from 'bcrypt';
const salt = bcrypt.genSaltSync(10)
require('dotenv').config();
import { generateToken, verifyToken } from '../helpers/jwt.helper';
import { Sequelize, Op, where } from 'sequelize';
import { raw } from 'body-parser';
const debug = console.log.bind(console);
let tokenList = {};
const accessTokenLife = process.env.ACCESS_TOKEN_LIFE || '7d';
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET || 'refresh-token-secret-example--green-cat-a@';
const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE || '3650d';
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET || 'refresh-token-secret-example--green-cat-a@';

require('dotenv').config();
const cloudinary = require('cloudinary').v2
cloudinary.config({
    cloud_name: process.env.CLOUND_NAME || 'dsvacsceu',
    api_key: process.env.API_KEY || '985563361639596',
    api_secret: process.env.API_SECRET || '5HLvQ7zYAabvuTbNi03uzLuU1EM',
    secure: true
});

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {}
            let isExist = await checkUserEmail(email)
            if (isExist) {
                let userData = await compareUserPassword(email, password)
                //exist-> compare password
                resolve(userData)
            } else {
                userData.errCode = 1
                userData.errMessage = `Your's email isn't exist in system.Please try other email`
                resolve(userData)
            }
        } catch (e) {
            reject(e)
        }
    })
}
let handleUserOffline = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.User.update({
                isOnline: 0,
            }, {
                where: { id: id }
            })
            resolve('set offline done')
        } catch (error) {
            reject(error)
        }
    })
}
let handleUserOnline = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.User.update({
                isOnline: 1,
            }, {
                where: { id: id }
            })
            resolve('set online done')
        } catch (error) {
            reject(error)
        }
    })
}

let compareUserPassword = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {}
            let user = await db.User.findOne({
                where: { email: email },
                raw: true
            })
            if (user) {
                let check = bcrypt.compareSync(password, user.password)
                if (check) {

                    //set online
                    // await db.User.update({
                    //     isOnline: 1,
                    // }, {
                    //     where: { id: user.id }
                    // })
                    userData.errCode = 0
                    userData.errMessage = 'Ok'
                    delete user.password
                    userData.user = user
                    const accessToken = await generateToken(user, accessTokenSecret, accessTokenLife)
                    const refreshToken = await generateToken(user, refreshTokenSecret, refreshTokenLife)
                    tokenList[refreshToken] = { accessToken, refreshToken }
                    userData.token = { accessToken, refreshToken }
                } else {
                    userData.errCode = 3
                    userData.errMessage = 'Wrong password'
                }
            } else {
                userData.errCode = 2
                userData.errMessage = `Your's email isn't exist`
            }
            resolve(userData)
        } catch (error) {
            reject(error)
        }
    })
}

let checkUserEmail = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email }
            })
            if (user) {
                resolve(true)
            } else {
                resolve(false)
            }
        } catch (e) {
            reject(e)
        }
    })
}

let getAllUser = (id, currentId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = ''
            let userGroups = ''
            id = id.toUpperCase()
            if (id === 'ALL') {
                users = await db.User.findAll({
                    where: {
                        id: {
                            [Op.ne]: currentId // Tìm tất cả các id không bằng userIdToExclude
                        }
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    raw: true
                })

                userGroups = await db.UserGroup.findAll({
                    where: {
                        idUser: currentId
                    },
                    raw: true
                })

                for (let i = 0; i < users.length; i++) {
                    users[i].isGroup = 0
                    let messages = await db.Message.findOne({
                        where: {
                            [Sequelize.Op.or]: [
                                { idSend: currentId, idReceive: users[i].id },
                                { idSend: users[i].id, idReceive: currentId }
                            ],
                            isGroup: 0
                        },
                        order: [['createdAt', 'DESC']], // Sắp xếp theo thời gian tạo
                        raw: true
                    });
                    if (messages !== null) {
                        users[i].lastMessagesTime = messages.createdAt
                        users[i].nameSend = messages.idSend == currentId ? "Bạn" : users[i].nameUser
                        switch (messages.type) {
                            case 'text':
                                users[i].lastMessages = messages.content
                                break;
                            case 'img':
                                users[i].lastMessages = 'Đã gửi 1 ảnh'
                                break;
                            case 'video':
                                users[i].lastMessages = 'Đã gửi 1 video'
                                break;
                            default:
                                break;
                        }
                    } else {
                        users[i].lastMessages = ''
                        users[i].lastMessagesTime = 0
                    }
                }

                for (let i = 0; i < userGroups.length; i++) {
                    let messages = await db.MessagesGroup.findOne({
                        where: {
                            idReceive: userGroups[i].idGroup,
                            isGroup: 1
                        },
                        order: [['createdAt', 'DESC']], // Sắp xếp theo thời gian tạo
                        raw: true
                    });
                    let group = await db.Group.findOne({
                        where: {
                            id: userGroups[i].idGroup
                        },
                        raw: true
                    })
                    group.nameUser = group.nameGroup
                    group.avatar = group.avatarGroup
                    group.isGroup = 1
                    if (messages !== null) {


                        let nameUser = await db.User.findOne({
                            where: {
                                id: messages.idSend
                            },
                            raw: true
                        })
                        group.lastMessagesTime = messages.createdAt
                        group.nameSend = messages.idSend == currentId ? "Bạn" : nameUser.nameUser
                        switch (messages.type) {
                            case 'text':
                                group.lastMessages = messages.content
                                break;
                            case 'img':
                                group.lastMessages = 'Đã gửi 1 ảnh'
                                break;
                            case 'video':
                                group.lastMessages = 'Đã gửi 1 video'
                                break;
                            default:
                                break;
                        }
                    } else {
                        group.lastMessages = ''
                        group.lastMessagesTime = 0
                    }
                    users.push(group);
                }

                users = users.sort((a, b) => {
                    const timeA = new Date(a.lastMessagesTime).getTime() || 0;
                    const timeB = new Date(b.lastMessagesTime).getTime() || 0;
                    return timeB - timeA
                })
            }
            if (id && id !== 'ALL') {
                users = await db.User.findOne({
                    where: { id },
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            // console.log(users);
            resolve(users)
        } catch (error) {
            reject(error)
        }
    })
}

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let check = await checkUserEmail(data.email)
            if (check === true) {
                resolve({
                    errCode: 1,
                    errMessage: "email is already in used please try another email!"
                })
            } else {
                let hashPasswordFromBcrypt = await hashUserPassword(data.password)
                if (!data.img) {
                    await db.User.create({
                        email: data.email,
                        password: hashPasswordFromBcrypt,
                        nameUser: data.nameUser,
                    })
                } else {
                    await db.User.create({
                        email: data.email,
                        password: hashPasswordFromBcrypt,
                        nameUser: data.nameUser,
                        avatar: data.img
                    })
                }
                resolve({
                    errCode: 0,
                    errMessage: 'OK'
                })
            }

        } catch (error) {
            reject(error)
        }
    })
}
let upvideo = (video) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!video) {
                resolve({
                    errCode: 1,
                    errMessage: 'Not have video'
                })
            }
            else {
                const videoData = video.buffer.toString('base64');
                let rs = ''
                rs = await cloudinary.uploader.upload(`data:${video.mimetype};base64,${videoData}`, { resource_type: 'video' })
                    .then(result => result)
                    .catch(error => {
                        console.log(error)
                        return ''
                    })
                if (rs === '') {
                    resolve({
                        errCode: 2,
                        errMessage: 'not upload content lesson'
                    })
                } else {
                    resolve({
                        errCode: 0,
                        errMessage: 'created OK',
                        video: rs.secure_url
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = bcrypt.hashSync(password, salt)
            resolve(hashPassword)
        } catch (e) {
            reject(e)
        }
    })
}

let deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id }
            })
            if (!user) {
                resolve({
                    errCode: 2,
                    errMessage: "the user isn't exist"
                })
            }
            await db.User.destroy({
                where: { id }
            })
            resolve({
                errCode: 0,
                errMessage: "delete successfully!"
            })
        } catch (error) {
            reject(error)
        }
    })
}

let updateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: "Missing id update"
                })
            }
            let user = await db.User.findOne({
                where: { id: data.id }
            })
            if (!user) {
                resolve({
                    errCode: 1,
                    errMessage: "the user not found"
                })
            }
            else {
                if (data.option === 'name') {
                    await db.User.update({
                        nameUser: data.value,
                    }, {
                        where: { id: data.id }
                    })
                    resolve({
                        errCode: 0,
                        errMessage: "update name success"
                    })
                }
                if (data.option === 'email') {
                    let check = await checkUserEmail(data.value)
                    if (check === true) {
                        resolve({
                            errCode: 1,
                            errMessage: "email exist"
                        })
                    } else {
                        await db.User.update({
                            email: data.value,
                        }, {
                            where: { id: data.id }
                        })
                        resolve({
                            errCode: 0,
                            errMessage: "update email success"
                        })
                    }
                }
                if (data.option === 'img') {
                    await db.User.update({
                        avatar: data.value,
                    }, {
                        where: { id: data.id }
                    })
                    resolve({
                        errCode: 0,
                        errMessage: "update img success"
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
let updateGroupData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: "Missing id update"
                })
            }
            let group = await db.Group.findOne({
                where: { id: data.id }
            })
            if (!group) {
                resolve({
                    errCode: 1,
                    errMessage: "the group not found"
                })
            }
            else {
                if (data.option === 'name') {
                    await db.Group.update({
                        nameGroup: data.value,
                    }, {
                        where: { id: data.id }
                    })
                    resolve({
                        errCode: 0,
                        errMessage: "update name group success"
                    })
                }
                if (data.option === 'img') {
                    await db.Group.update({
                        avatarGroup: data.value,
                    }, {
                        where: { id: data.id }
                    })
                    resolve({
                        errCode: 0,
                        errMessage: "update img group success"
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}

let getOnlyAllUser = (currentId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = ''
            users = await db.User.findAll({
                where: {
                    id: {
                        [Op.ne]: currentId // Tìm tất cả các id không bằng userIdToExclude
                    }
                },
                attributes: {
                    exclude: ['password']
                },
                raw: true
            })
            resolve(users)
        } catch (error) {
            reject(error)
        }
    })
}


/**
 * controller refreshToken
 * @param {*} req 
 * @param {*} res 
 */
let refreshToken = async (req, res) => {
    // User gửi mã refresh token kèm theo trong body
    const refreshTokenFromClient = req.body.refreshToken

    // Nếu như tồn tại refreshToken truyền lên và nó cũng nằm trong tokenList của chúng ta
    if (refreshTokenFromClient && (tokenList[refreshTokenFromClient])) {
        try {
            // Verify kiểm tra tính hợp lệ của cái refreshToken và lấy dữ liệu giải mã decoded 
            const decoded = await jwtHelper.verifyToken(refreshTokenFromClient, refreshTokenSecret);
            // Thông tin user lúc này các bạn có thể lấy thông qua biến decoded.data
            const userFakeData = decoded.data;
            const accessToken = await jwtHelper.generateToken(userFakeData, accessTokenSecret, accessTokenLife);
            // gửi token mới về cho người dùng
            return res.status(200).json({ accessToken })
        } catch (error) {
            res.status(403).json({
                message: 'Invalid refresh token.',
            });
        }
    } else {
        // Không tìm thấy token trong request
        return res.status(403).send({
            message: 'No token provided.',
        });
    }
};

export default {
    handleUserLogin,
    getAllUser,
    createNewUser,
    deleteUser,
    updateUserData,
    refreshToken,
    handleUserOffline,
    handleUserOnline,
    getOnlyAllUser,
    upvideo,
    updateGroupData
};

