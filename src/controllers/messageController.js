import messageService from '../services/messageService';

let createMessage = async (req, res) => {
    let idSend = req.body.idSend;
    let content = req.body.content;
    let idReceive = req.body.idReceive;
    let isGroup = req.body.isGroup;
    let type = req.body.type;
    if (!idSend || !idReceive || !content || !type) {
        return res.status(400).send({
            errCode: 1,
            errMessage: "missingparammeter"
        })
    } else {
        if (!isGroup) {
            let message = await messageService.createMessage(idSend, content, idReceive, isGroup, type)
            return res.status(200).json(message)
        } else {
            let messageGroup = await messageService.createMessageGroup(idSend, content, idReceive, isGroup, type)
            return res.status(200).json(messageGroup)
        }
    }
}

let getMessageByUser1AndUser2 = async (req, res) => {
    let userId1 = req.query.user1;
    let userId2 = req.query.user2;
    if (!userId1 || !userId2) {
        return res.status(400).send({
            errCode: 3,
            errMessage: "parameter error"
        })
    } else {
        let messages = await messageService.getMessageByUser1AndUser2(userId1, userId2)
        return res.status(200).json(messages)
    }
}
let getMessageByGroup = async (req, res) => {
    let groupId = req.query.groupId
    if (groupId) {
        let message = await messageService.getMessageByGroup(groupId);
        return res.status(200).json(message)
    }
}
let deleteMessage = async (req, res) => {
    let id = req.query.id
    let isGroup = req.query.isGroup
    if (id) {
        let message = await messageService.deleteMessage(id, isGroup);
        return res.status(200).json(message)
    }
}
export default {
    createMessage,
    getMessageByUser1AndUser2,
    getMessageByGroup,
    deleteMessage
}