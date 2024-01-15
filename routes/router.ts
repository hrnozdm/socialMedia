import {Router,Request,Response} from "express";
import AuthController from "../controllers/AuthController";
import UserController from "../controllers/UserController";
import PostController from "../controllers/PostController";


const router=Router();
router.get('/',(req:Request,res:Response)=>{res.send('Anasayfa')});
router.post('/register',AuthController.register);
router.post('/login',AuthController.login);
router.put('/user/:id',UserController.updateUser)
router.delete('/user/:id',UserController.deleteUser)
router.get('/user/:id',UserController.getUser)
router.put('/user/follow/:id',UserController.follow)
router.put('/user/unfollow/:id',UserController.unfollow)
router.get('/posts',PostController.createPost)
export default router;

