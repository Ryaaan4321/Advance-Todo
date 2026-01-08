import bcrypt from 'bcrypt'
import { Request } from 'express'
import { Response } from 'express'
import client from '../../prisma.js'
import jwt from 'jsonwebtoken'
import { signAccessToken, signRefreshToken } from '../../lib/validator.js';
import { REFRESH_SECRET } from '../../config/env.js'
export async function signup(req: Request, res: Response): Promise<Response> {
    try {
        const { email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await client.user.create({
            data: { email, password: hashedPassword }
        })
        const refreshTokenRow = await prisma?.refreshToken.create({
            data: {
                userId: user.id,
                tokenHash: crypto.randomUUID(),
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            }
        })
        const accessToken = signAccessToken(user.id);
        const refreshToken = signRefreshToken(refreshTokenRow?.id);
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict"
        })
        return res.status(200).json({ msg: "succesfully user is created" })
    } catch (e) {
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
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict"
        });
        return res.status(200).json({ msg: "user is logged in", accessToken })
    } catch (e) {
        return res.status(500).json({ msg: "there is an error on this code" });
    }
}
export async function refresh(req: Request, res: Response): Promise<Response> {
    const token = req.cookies.refreshToken;
    if (!token) return res.sendStatus(401);

    try {
        const payload = jwt.verify(token, REFRESH_SECRET) as any;

        const stored = await client.refreshToken.findUnique({
            where: { id: payload.jti }
        });

        if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
            return res.sendStatus(401);
        }
        await client.refreshToken.update({
            where: { id: stored.id },
            data: { revoked: true }

        })
        const newTokenRow = await client.refreshToken.create({
            data: {
                userId: stored.userId,
                tokenHash: crypto.randomUUID(),
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            }
        });
        const newAccess = signAccessToken(stored.userId);
        const newRefresh = signRefreshToken(newTokenRow.id);
        res.cookie("refreshToken", newRefresh, {
            httpOnly: true,
            secure: true,
            sameSite: "strict"
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
        const payload = jwt.verify(token, REFRESH_SECRET) as any;
        await client.refreshToken.update({
            where: { id: payload.jti },
            data: { revoked: true }
        });
    } catch {

    }
    res.clearCookie("refreshToken");
    return res.sendStatus(204);

}