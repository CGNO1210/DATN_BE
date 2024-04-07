import db from '../models/index';
import { Sequelize } from 'sequelize';
require('dotenv').config();
const cloudinary = require('cloudinary').v2
cloudinary.config({
    cloud_name: process.env.CLOUND_NAME || 'dsvacsceu',
    api_key: process.env.API_KEY || '985563361639596',
    api_secret: process.env.API_SECRET || '5HLvQ7zYAabvuTbNi03uzLuU1EM',
    secure: true
});

let createMessage = (idSend, content, idReceive, isGroup, type) => {
    return new Promise(async (resolve, reject) => {
        try {
            let save_cotent = content
            let rs = ''
            switch (type) {
                case 'img':
                    // const imageData = content.buffer.toString('base64');
                    rs = await cloudinary.uploader.upload(content, { folder: "uploads" })
                        .then(result => result)
                        .catch(error => {
                            console.log(error)
                            return ''
                        })
                    if (rs === '') {
                        resolve({
                            errCode: 2,
                            errMessage: 'not upload img'
                        })
                    }
                    else {
                        save_cotent = rs.secure_url;
                        await db.Message.create({
                            idSend,
                            content: save_cotent,
                            idReceive,
                            isGroup,
                            type
                        })
                        resolve({
                            errCode: 0,
                            errMessage: 'Create message successfully!!'
                        })
                    }
                    break;
                case 'video':
                    const videoData = content.buffer.toString('base64');
                    rs = await cloudinary.uploader.upload(`data:${video.mimetype};base64,${videoData}`)
                        .then(result => result)
                        .catch(error => {
                            console.log(error)
                            return ''
                        })
                    if (rs === '') {
                        resolve({
                            errCode: 2,
                            errMessage: 'not upload video'
                        })
                    }
                    else {
                        save_cotent = rs.secure_url;
                        await db.Message.create({
                            idSend,
                            content: save_cotent,
                            idReceive,
                            isGroup,
                            type
                        })
                        resolve({
                            errCode: 0,
                            errMessage: 'Create message successfully!!'
                        })
                    }
                    break;

                default:
                    break;
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