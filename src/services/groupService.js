import { where, Sequelize } from 'sequelize';
import db from '../models/index';

let createGroup = (nameGroup, ownGroup, groupMembers) => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.Group.create({
                nameGroup,
                ownGroup,
                raw: true
            }).then(
                async (data) => {
                    await db.UserGroup.create({
                        idUser: data.dataValues.ownGroup,
                        idGroup: data.dataValues.id
                    })
                    await db.MessagesGroup.create({
                        idSend: data.dataValues.ownGroup,
                        idReceive: data.dataValues.id,
                        content: "welcome",
                        isGroup: true,
                        type: 'text'
                    })
                    groupMembers.forEach(async (member) => {
                        await db.UserGroup.create({
                            idUser: member.id,
                            idGroup: data.dataValues.id
                        })
                    });
                    resolve({
                        errCode: 0,
                        errMessage: 'create group successfully'
                    })
                }
            )

        } catch (error) {
            reject(error)
        }
    })
}

let addMemberGroup = (idUsers, idGroup, ownGroup) => {
    return new Promise(async (resolve, reject) => {
        try {
            let group = await db.Group.findOne({
                where: {
                    id: idGroup
                },
                raw: true
            })
            if (group.ownGroup != ownGroup) {
                console.log('asa');

                reject({
                    errCode: 1,
                    errMessage: "you don't have permission to add"
                })
            } else {
                for (let i = 0; i < idUsers.length; i++) {
                    await db.UserGroup.create({
                        idUser: idUsers[i],
                        idGroup
                    })
                }
                resolve({
                    errCode: 0,
                    errMessage: 'add member successfully!'
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let deleteMemberGroup = (idUsers, idGroup, ownGroup) => {
    return new Promise(async (resolve, reject) => {
        try {
            let group = await db.Group.findOne({
                where: {
                    id: idGroup
                },
                raw: true
            })
            if (group.ownGroup != ownGroup) {
                reject({
                    errCode: 1,
                    errMessage: "you don't have permission to delete"
                })
            } else {
                for (let i = 0; i < idUsers.length; i++) {
                    await db.UserGroup.destroy({
                        where: {
                            idUser: idUsers[i],
                            idGroup
                        },
                    })
                    //delete msg group by idUser
                }
                resolve({
                    errCode: 0,
                    message: "delete successfully!"
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getGroupById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            await db.Group.findOne({
                where: {
                    id
                },
                raw: true
            }).then((result) => {
                result.avatar = result.avatarGroup
                result.nameUser = result.nameGroup
                resolve({
                    errCode: 0,
                    errMessage: 'get group Success!',
                    group: result
                })
            })
        } catch (error) {
            reject(error)
        }
    })
}
let getGroupsByIdUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userGroups = await db.UserGroup.findAll({
                where: {
                    idUser: id
                },
                raw: true
            })
            let groups = []
            for (let i = 0; i < userGroups.length; i++) {
                let group = await db.Group.findOne({
                    where: {
                        id: userGroups[i].idGroup
                    },
                    raw: true
                })
                group.nameUser = group.nameGroup
                group.avatar = group.avatarGroup
                group.isGroup = 1

                groups.push(group);
            }
            resolve({
                errCode: 0,
                errMessage: 'get group by id user Success!',
                groups
            })
        } catch (error) {
            reject(error)
        }
    })
}

let getMembersGroup = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userGroups = await db.UserGroup.findAll({
                where: {
                    idGroup: id
                },
                raw: true
            })
            let users = []
            for (let i = 0; i < userGroups.length; i++) {
                let user = await db.User.findOne({
                    where: {
                        id: userGroups[i].idUser
                    },
                    raw: true
                })

                users.push(user);
            }
            resolve({
                errCode: 0,
                errMessage: 'get group by id user Success!',
                users
            })
        } catch (error) {
            reject(error)
        }
    })
}
let getMemberNotInGroup = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userGroups = await db.UserGroup.findAll({
                where: {
                    idGroup: id
                },
                raw: true
            })
            let users = []
            for (let i = 0; i < userGroups.length; i++) {
                let user = await db.User.findOne({
                    where: {
                        id: userGroups[i].idUser
                    },
                    raw: true
                })

                users.push(user);

            }
            let usersId = users.map(v => v.id);
            let rs = await db.User.findAll({
                where: {
                    id: {
                        [Sequelize.Op.notIn]: usersId
                    }
                },
                raw: true
            })
            resolve({
                errCode: 0,
                errMessage: 'get group by id user Success!',
                users: rs
            })
        } catch (error) {
            reject(error)
        }
    })
}



export default {
    createGroup,
    getGroupById,
    getGroupsByIdUser,
    getMembersGroup,
    getMemberNotInGroup,
    addMemberGroup,
    deleteMemberGroup
}