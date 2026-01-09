import { Request, Response } from "express";
import prisma from "../../prisma.js";
import { Prisma } from "@prisma/client";
import { TaskStatus } from "@prisma/client";

export async function createTodo(req: Request, res: Response): Promise<Response> {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ msg: "unauthorized" });
        }
        console.log("token from the create todo = ", userId);
        if (!userId) {
            return res.status(401).json({ msg: "unauthorized" })
        }
        const { title, description } = req.body;
        const rawStatus = req.body.status;
        let status: TaskStatus = TaskStatus.PENDING;
        if (rawStatus === "completed") {
            status = TaskStatus.COMPLETED;
        }
        const newTodo = await prisma.task.create({
            data: {
                title: title,
                description: description,
                status,
                userId
            }
        })
        return res.status(201).json({ msg: "todo is created", newTodo })
    } catch (e) {
        return res.status(500).json({ msg: "something wrong happened while creating the todo" })
    }
}

export async function getTodos(req: Request, res: Response): Promise<Response> {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ msg: "unauthorized" });
        }
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const status = req.query.status as string | undefined;
        const search = req.query.search as string | undefined;
        const where: Prisma.TaskWhereInput = {
            userId
        }
        console.log("where == ", where);
        const skip = (page - 1) * limit;
        if (status === 'completed') {
            where.status = "COMPLETED"
        }
        if (status === 'pending') {
            where.status = "PENDING"
        }
        if (search) {
            where.title = {
                contains: search,
                mode: 'insensitive'
            }
        }
        console.log("before the thing")
        const tasks = await prisma.task.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
        });

        const total = await prisma.task.count({ where });
        console.log("Tasks == ", tasks);
        return res.status(200).json({
            msg: "fetched todos successfully",
            data: tasks,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (e) {
        console.error("error from the get todo ", e);
        return res.status(500).json({ msg: "something is wrong" })
    }
}