import db from '../models/index';

let createGroup = (nameGroup, idOwnUser) => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.Group.create({
                nameGroup,
                ownGroup: idOwnUser
            })
            let group = await db.UserGroup.findOne({
                where: {
                    nameGroup: nameGroup,
                    ownGroup: idOwnUser
                },
                raw: true
            })
            await db.UserGroup.create({
                idUser: group.ownGroup,
                idGroup: group.id
            })
            resolve({
                errCode: 0,
                errMessage: 'create group successfully'
            })
        } catch (error) {
            reject(error)
        }
    })
}
let joinGroup = (idUser, idGroup) => {
    return new Promise(async (resolve, reject) => {
        try {

            await db.UserGroup.create({
                idUser: idUser,
                idGroup: idGroup
            })
            resolve({
                errCode: 0,
                errMessage: 'join group successfully'
            })
        } catch (error) {
            reject(error)
        }
    })
}
export default {
    createGroup,
    joinGroup
}