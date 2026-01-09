import express from 'express'
import { userAuth } from '../../middlewares/auth-middleware.js';
import { createTodo, getTodos } from '../../controllers/todo_controllers/todo.controller.js';

const todoRouter=express.Router();

todoRouter.post('/create',userAuth,createTodo);
todoRouter.get('/',userAuth,getTodos);
export default todoRouter;