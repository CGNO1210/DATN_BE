import groupService from '../services/groupService';

let createGroup = async (req, res) => {
    try {
        let nameGroup = req.body.nameGroup
        let ownGroup = req.body.ownGroup
        let groupMembers = req.body.groupMembers
        if (!nameGroup || !ownGroup || !groupMembers) {
            return res.status(400).send({ message: "Missing fields" })
        } else {
            let rs = await groupService.createGroup(nameGroup, ownGroup, groupMembers);
            res.status(200).json(rs)
        }
    } catch (error) {
        console.log(error);
    }
}
let addMemberGroup = async (req, res) => {
    try {
        let idUsers = req.body.idUsers
        let idGroup = req.body.idGroup
        let ownGroup = req.body.ownGroup
        let rs = await groupService.addMemberGroup(idUsers, idGroup, ownGroup);
        res.status(200).json(rs)
    } catch (error) {

    }
}
let deleteMemberGroup = async (req, res) => {
    try {
        let idUsers = req.body.idUsers
        let idGroup = req.body.idGroup
        let ownGroup = req.body.ownGroup
        let rs = await groupService.deleteMemberGroup(idUsers, idGroup, ownGroup);
        res.status(200).json(rs)
    } catch (error) {

    }
}
let getGroupById = async (req, res) => {
    try {
        let id = req.query.id;
        if (id) {
            let rs = await groupService.getGroupById(id)
            res.status(200).json(rs)
        }
    } catch (error) {

    }
}
let getGroupsByIdUser = async (req, res) => {
    try {
        let id = req.query.id;
        if (id) {
            let rs = await groupService.getGroupsByIdUser(id)
            res.status(200).json(rs)
        }
    } catch (error) {

    }
}
let getMembersGroup = async (req, res) => {
    try {
        let id = req.query.id;
        if (id) {
            let rs = await groupService.getMembersGroup(id)
            res.status(200).json(rs)
        }
    } catch (error) {

    }
}
let getMemberNotInGroup = async (req, res) => {
    try {
        let id = req.query.id;
        if (id) {
            let rs = await groupService.getMemberNotInGroup(id)
            res.status(200).json(rs)
        }
    } catch (error) {

    }
}
export default {
    createGroup,
    addMemberGroup,
    getGroupById,
    getGroupsByIdUser,
    getMembersGroup,
    getMemberNotInGroup,
    deleteMemberGroup
}