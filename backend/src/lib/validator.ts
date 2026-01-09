import jwt from 'jsonwebtoken'

const ACCESS_SECRET = process.env.ACCESS_SECRET!
const REFRESH_TOKEN = process.env.REFRESH_TOKEN!
export function signAccessToken(userId: string |undefined) {
    return jwt.sign({ sub: userId }, ACCESS_SECRET, { expiresIn: "15m" })
}
export function signRefreshToken(tokenId: string |undefined) {
    return jwt.sign({ jti: tokenId }, REFRESH_TOKEN, { expiresIn: "7d" })
}