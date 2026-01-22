import dotnev from 'dotenv'
import bcrypt from 'bcrypt'
import { Request } from 'express'
import { Response } from 'express'
import client from '../../prisma.js'
import jwt from 'jsonwebtoken'
import { signAccessToken, signRefreshToken } from '../../lib/validator.js'
import { REFRESH_SECRET } from '../../config/env.js'
dotnev.config();
const isProd = process.env.NODE_ENV === "production"
console.log("is prod== ", isProd);
export async function signup(req: Request, res: Response): Promise<Response> {
    console.log("headers:", req.headers["content-type"]);
    console.log("raw body:", req.body);
    console.log("req body ", req.body);
    try {
        console.log("inside the try block");
        const { email, password } = req.body;
        console.log("email from the signup ", email);
        console.log("password from the signup ", password);
        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            email.trim() === "" ||
            password.trim() === ""
        ) {
            return res.status(400).json({
                message: "Invalid email or password",
            });
        }
        const existingUser = await client.user.findUnique({
            where: { email },
        });
        console.log("exiting user == ", existingUser);
        if (existingUser) {
            return res.status(409).json({
                message: "Email already registered",
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await client.user.create({
            data: { email, password: hashedPassword }
        })
        console.log("user == ", user);
        const refreshTokenRow = await client?.refreshToken.create({
            data: {
                userId: user.id,
                tokenHash: crypto.randomUUID(),
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            }
        })
        console.log("refresh TOken == ", refreshTokenRow);
        const accessToken = signAccessToken(user.id);
        const refreshToken = signRefreshToken(refreshTokenRow?.id);
        console.log("reefresh token from the register request == ", refreshToken)
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? "none" : "lax",
        })
        return res.status(200).json({ msg: "succesfully user is created", accessToken })
    } catch (e) {
        console.error(e);
        return res.status(500).json({ msg: "there is an error on this code" })
    }
}
export async function signin(req: Request, res: Response): Promise<Response> {
    try {
        const { email, password } = req.body;
        const user = await client.user.findUnique({ where: { email: email } });
        if (!user) {
            return res.status(401).json({ msg: "unauthorized" })
        }
        const ok = await bcrypt.compare(password, user.password);
        if (!ok) {
            return res.status(401).json({ msg: "invalid credentials" })
        }
        const refreshTokenRow = await client.refreshToken.create({
            data: {
                userId: user.id,
                tokenHash: crypto.randomUUID(),
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            }
        });
        const accessToken = signAccessToken(user.id);
        const refreshToken = signRefreshToken(refreshTokenRow.id);
        console.log("refresh token from the login request == ", refreshToken);
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? "none" : "lax",
        });
        return res.status(200).json({ msg: "user is logged in", accessToken })
    } catch (e) {
        console.error(e);
        return res.status(500).json({ msg: "there is an error on this code" });
    }
}
export async function refresh(req: Request, res: Response): Promise<Response> {
    const token = req.cookies.refreshToken;
    if (!token) return res.sendStatus(401);
    try {
        console.log("inside the try blockk");
        const refreshToken = REFRESH_SECRET();
        const payload = jwt.verify(token, refreshToken) as any;
        const stored = await client.refreshToken.findUnique({
            where: { id: payload.jti }
        });

        console.log("payload == ", payload);
        console.log("stored == ", stored);
        if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
            return res.sendStatus(401);
        }
        const updatedTokenresult = await client.refreshToken.update({
            where: { id: stored.id },
            data: { revoked: true }

        })
        console.log("updated toekn ", updatedTokenresult);
        const newTokenRow = await client.refreshToken.create({
            data: {
                userId: stored.userId,
                tokenHash: crypto.randomUUID(),
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            }
        });
        console.log("new token == ", newTokenRow);
        const newAccess = signAccessToken(stored.userId);
        const newRefresh = signRefreshToken(newTokenRow.id);
        res.cookie("refreshToken", newRefresh, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax"
        });
        return res.status(200).json({ accessToken: newAccess });
    } catch {
        return res.status(500).json({ msg: "something is wrong" });
    }
}
export async function logout(req: Request, res: Response): Promise<Response> {
    const token = req.cookies.refreshToken;
    if (!token) return res.sendStatus(204);
    try {
        const refreshToken = REFRESH_SECRET();
        const payload = jwt.verify(token, refreshToken) as any;
        await client.refreshToken.update({
            where: { id: payload.jti },
            data: { revoked: true }
        });
    } catch {

    }
    res.clearCookie("refreshToken");
    return res.sendStatus(204);

}

/*
fetch("/auth/refresh", {
  method: "POST",
  credentials: "include",
});

axios.post("/auth/refresh", {}, { withCredentials: true });

*/