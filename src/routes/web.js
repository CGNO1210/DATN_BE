import express from 'express';
import userController from '../controllers/userController';
import messageController from '../controllers/messageController';
import groupController from '../controllers/groupController';
import multer from 'multer';
import AuthMiddleWare from '../middlewares/AuthMiddleware';

const storage = multer.memoryStorage();
const upload = multer({ storage });

let router = express.Router();

let initWebRoutes = (app) => {
    router.post("/api/login", userController.handleLogin)
    router.post("/api/register", upload.single('img'), userController.handleCreateNewUser)
    router.post("/refeshToken", userController.refreshToken)
    router.post("/api/createNewUser", userController.handleCreateNewUser)
    //auth
    //router.use(AuthMiddleWare.isAuth)
    router.get('/api/getAllUser', userController.handleGetAllUser)
    router.post('/api/createMessage', messageController.createMessage)
    router.get('/api/getMessagesPrivate', messageController.getMessageByUser1AndUser2)
    router.get('/api/getMessagesGroup', messageController.getMessageByGroup)
    router.post('/api/createGroup', groupController.createGroup)
    router.post('/api/joinGroup', groupController.joinGroup)
    // router.get("/test", (req, res) => {
    //     return res.status(200).json({
    //         errCode: 0,
    //         errMessage: "Success",
    //         data: "Test abcd"
    //     })
    // })
    // router.get('/login', (req, res) => {
    //     res.render('login.ejs')
    // })
    // router.get('/register', (req, res) => {
    //     res.render('register.ejs')
    // })
    // router.get("/temp", (req, res) => {
    //     res.render("temp.ejs")
    // })
    // router.get("/", (req, res) => {
    //     res.render("home.ejs")
    // })
    return app.use("/", router);
}

export default initWebRoutes;