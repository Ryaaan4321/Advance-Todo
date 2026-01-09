import express from 'express'
import { userAuth } from '../../middlewares/auth-middleware.js';
import { createTasks, deleteTask, getTaskByid, getTasks, toggleTaskStatus, updateTask } from '../../controllers/todo_controllers/todo.controller.js';

const todoRouter = express.Router();
todoRouter.use(userAuth)
todoRouter.post('/', createTasks);
todoRouter.get('/', getTasks);
todoRouter.get('/:id', getTaskByid);
todoRouter.patch('/:id', updateTask);
todoRouter.delete('/:id', deleteTask);
todoRouter.patch('/:id/toggle', toggleTaskStatus);
export default todoRouter;