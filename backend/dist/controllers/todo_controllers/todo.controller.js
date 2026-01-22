import prisma from "../../prisma.js";
import { TaskStatus } from "@prisma/client";
export async function createTasks(req, res) {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ msg: "unauthorized" });
        }
        console.log("token from the create todo = ", userId);
        if (!userId) {
            return res.status(401).json({ msg: "unauthorized" });
        }
        const { title, description } = req.body;
        const rawStatus = req.body.status;
        let status = TaskStatus.PENDING;
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
        });
        return res.status(201).json(newTodo);
    }
    catch (e) {
        return res.status(500).json({ msg: "something wrong happened while creating the todo" });
    }
}
export async function getTasks(req, res) {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ msg: "unauthorized" });
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status;
        const search = req.query.search;
        const where = {
            userId
        };
        console.log("where == ", where);
        const skip = (page - 1) * limit;
        if (status === 'completed') {
            where.status = "COMPLETED";
        }
        if (status === 'pending') {
            where.status = "PENDING";
        }
        if (search) {
            where.title = {
                contains: search,
                mode: 'insensitive'
            };
        }
        console.log("before the thing");
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
            tasks,
            meta: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    }
    catch (e) {
        console.error("error from the get todo ", e);
        return res.status(500).json({ msg: "something is wrong" });
    }
}
export async function getTaskByid(req, res) {
    try {
        const userId = req.userId;
        const { id } = req.params;
        const task = await prisma.task.findFirst({ where: { id, userId } });
        if (!task) {
            return res.status(404).json({ msg: "task not found..!" });
        }
        return res.status(200).json({ msg: "successfull", task });
    }
    catch (e) {
        return res.status(500).json({ msg: "error on the code" });
    }
}
export async function updateTask(req, res) {
    const userId = req.userId;
    const { id } = req.params;
    const { title, description, status } = req.body;
    const task = await prisma.task.findFirst({
        where: { id, userId },
    });
    if (!task) {
        return res.status(404).json({ msg: 'task not found' });
    }
    const updated = await prisma.task.update({
        where: { id },
        data: {
            title,
            description,
            status,
        },
    });
    return res.json(updated);
}
export async function deleteTask(req, res) {
    const userId = req.userId;
    const { id } = req.params;
    const task = await prisma.task.findFirst({
        where: { id, userId },
    });
    if (!task) {
        return res.status(404).json({ msg: 'task not found' });
    }
    await prisma.task.delete({
        where: { id },
    });
    return res.status(204).send();
}
export async function toggleTaskStatus(req, res) {
    const userId = req.userId;
    const { id } = req.params;
    const task = await prisma.task.findFirst({
        where: { id, userId },
    });
    if (!task) {
        return res.status(404).json({ msg: 'task not found' });
    }
    const updated = await prisma.task.update({
        where: { id },
        data: {
            status: task.status === 'PENDING'
                ? 'COMPLETED'
                : 'PENDING',
        },
    });
    return res.json(updated);
}
