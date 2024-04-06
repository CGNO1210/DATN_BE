import groupService from '../services/groupService';

let createGroup = async (req,res) => { 
    try {
        let nameGroup = req.body.nameGroup
        let rs = await groupService.createGroup(nameGroup);
        res.status(200).json(rs)
    } catch (error) {
        
    }
}
let joinGroup = async (req,res) => { 
    try {
        let idUser = req.body.idUser
        let idGroup = req.body.idGroup
        let rs = await groupService.joinGroup(idUser,idGroup);
        res.status(200).json(rs)
    } catch (error) {
        
    }
}

export default {
    createGroup,
    joinGroup
}