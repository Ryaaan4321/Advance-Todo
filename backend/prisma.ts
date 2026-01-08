import { PrismaClient } from "@prisma/client"
// import { PrismaClient } from "@prisma/client/extension";
const prismaSingleton = () => {
    return new PrismaClient();
};

declare global {
    var prisma: PrismaClient | undefined;
}

const prisma = globalThis.prisma ?? prismaSingleton();
export default prisma;

if (process.env.NODE_ENV !== "production") {
    globalThis.prisma = prisma;
}
