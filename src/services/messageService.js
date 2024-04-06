import db from '../models/index';
import { Sequelize } from 'sequelize';
require('dotenv').config();
const cloudinary = require('cloudinary').v2
cloudinary.config({
    cloud_name: process.env.CLOUND_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: true
});

let createMessage = (idSend, content, idReceive, isGroup, type) => {
    return new Promise(async (resolve, reject) => {
        try {
            let save_cotent = content
            let rs = ''
            switch (type) {
                case 'img':
                    const imageData = content.buffer.toString('base64');
                    rs = await cloudinary.uploader.upload(`data:${img.mimetype};base64,${imageData}`)
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
                    else{
                        save_cotent=rs.secure_url;
                    }
                    break;
                case 'img':
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
                    else{
                        save_cotent=rs.secure_url;
                    }
                    break;

                default:
                    break;
            }

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