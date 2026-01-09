import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import express from 'express'
import authRouter from './router/authrouter/auth.router.js';
import todoRouter from './router/todorouter/todo.router.js';


const app = express();
app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRouter);
app.use('/tasks',todoRouter)

app.listen(5000, () => {
    console.log("app is running")
})

export default app;