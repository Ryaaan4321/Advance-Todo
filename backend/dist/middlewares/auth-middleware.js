import jwt from "jsonwebtoken";
import { ACCESS_SECRET } from "../config/env.js";
export function userAuth(req, res, next) {
    const header = req.headers.authorization;
    console.log("header from the middleware  == ", header);
    if (!header)
        return res.sendStatus(401);
    const token = header.split(" ")[1];
    if (!token)
        return res.sendStatus(401);
    try {
        const payload = jwt.verify(token, ACCESS_SECRET);
        req.userId = payload.sub;
        next();
    }
    catch {
        return res.sendStatus(401);
    }
}
