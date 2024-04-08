import db from '../models/index';
import { Sequelize } from 'sequelize';

let createMessage = (idSend, content, idReceive, isGroup, type) => {
    return new Promise(async (resolve, reject) => {
        try {
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
                order: [['createdAt', 'DESC']] // Sắp xếp theo thời gian tạo, có thể sử dụng 'DESC' để sắp xếp giảm dần
            });

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

            let messages = await db.Message.findAll({
                where: {
                    idReceive: idGroup
                    // isGroup: 1
                },
                order: [['createdAt', 'DESC']] // Sắp xếp theo thời gian tạo, có thể sử dụng 'DESC' để sắp xếp giảm dần
            });

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
export default {
    createMessage,
    getMessageByUser1AndUser2,
    getMessageByGroup
}