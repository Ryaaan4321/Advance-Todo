import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import express from 'express'
import authRouter from './router/authrouter/auth.router.js';
import todoRouter from './router/todorouter/todo.router.js';
import cors from "cors"

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
)
app.use(express.json());
app.use(cookieParser());

app.use('/auth', authRouter);
app.use('/tasks',todoRouter)


app.listen(5000, () => {
    console.log("app is running")
})

export default app;