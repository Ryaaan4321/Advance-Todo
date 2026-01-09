import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import dotnev from 'dotenv'
dotnev.config();

console.log("direct url == ",process.env.DIRECT_URL);
const pool = new Pool({
  connectionString: process.env.DIRECT_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });
export default prisma;
