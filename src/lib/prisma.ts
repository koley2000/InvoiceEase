import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// 1. Create a PostgreSQL connection pool
// This replaces the internal Rust connection pool
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ 
  connectionString,
  // Optional: Configure pool limits for serverless/hot-reload
  max: process.env.NODE_ENV === 'development' ? 5 : 10,
});

// 2. Create the driver adapter
const adapter = new PrismaPg(pool);

// 3. Instantiate the Prisma Client with the adapter
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    // Optional: Logging is still configured here
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}