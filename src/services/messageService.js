import db from '../models/index';
import { Sequelize } from 'sequelize';

let createMessage = (idSend, content, idReceive, isGroup, type) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!isGroup) {
                await db.Message.create({
                    idSend,
                    content,
                    idReceive,
                    isGroup,
                    type
                })
                resolve({
                    errCode: 0,
                    errMessage: 'Create message successfully!!'
                })
            } else {
                //create message group
            }

        } catch (error) {
            reject(error)
        }
    })
}
let createMessageGroup = (idSend, content, idReceive, isGroup, type) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (isGroup) {
                await db.MessagesGroup.create({
                    idSend,
                    content,
                    idReceive,
                    isGroup,
                    type
                })
                resolve({
                    errCode: 0,
                    errMessage: 'Create message group successfully!!'
                })
            } else {
                //create message group
            }

        } catch (error) {
            reject(error)
        }
    })
}
let getMessageByUser1AndUser2 = (id1, id2) => {
    return new Promise(async (resolve, reject) => {
        try {

            let messages = await db.Message.findAll({
                where: {
                    [Sequelize.Op.or]: [
                        { idSend: id1, idReceive: id2 },
                        { idSend: id2, idReceive: id1 }
                    ],
                    isGroup: 0
                },
                order: [['createdAt', 'DESC']], // Sắp xếp theo thời gian tạo, có thể sử dụng 'DESC' để sắp xếp giảm dần
                raw: true
            });

            for (let i = 0; i < messages.length; i++) {
                let nameUser = await db.User.findOne({
                    where: {
                        id: messages[i].idSend
                    },
                    raw: true
                })
                messages[i].nameSend = nameUser.nameUser
            }

            resolve({
                errCode: 0,
                errMessage: 'Create successfully!!',
                messages
            })
        } catch (error) {
            reject(error)
        }
    })
}
let getMessageByGroup = (idGroup) => {
    return new Promise(async (resolve, reject) => {
        try {

            let messages = await db.MessagesGroup.findAll({
                where: {
                    idReceive: idGroup
                    // isGroup: 1
                },
                order: [['createdAt', 'DESC']], // Sắp xếp theo thời gian tạo, có thể sử dụng 'DESC' để sắp xếp giảm dần
                raw: true
            });
            for (let i = 0; i < messages.length; i++) {
                let nameUser = await db.User.findOne({
                    where: {
                        id: messages[i].idSend
                    },
                    raw: true
                })
                messages[i].nameSend = nameUser.nameUser
            }
            resolve({
                errCode: 0,
                errMessage: 'get message group successfully!!',
                messages
            })
        } catch (error) {
            reject(error)
        }
    })
}
let deleteMessage = (id, isGroup) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (isGroup == 1) {
                await db.MessagesGroup.destroy({
                    where: {
                        id
                    }
                })
            } else {
                await db.Message.destroy({
                    where: {
                        id
                    }
                })
            }
            resolve({
                errCode: 0,
                errMessage: 'delete message group successfully!!',
            })
        } catch (error) {
            reject(error)
        }
    })
}
export default {
    createMessage,
    getMessageByUser1AndUser2,
    getMessageByGroup,
    createMessageGroup,
    deleteMessage
}