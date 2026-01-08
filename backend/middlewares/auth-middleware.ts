import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ACCESS_SECRET } from "../config/env.js";

export function userAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization;
  if (!header) return res.sendStatus(401);

  const token = header.split(" ")[1];
  if (!token) return res.sendStatus(401);

  try {
    const payload = jwt.verify(token, ACCESS_SECRET) as { sub: string };
    req.userId = payload.sub;
    next();
  } catch {
    return res.sendStatus(401);
  }
}
