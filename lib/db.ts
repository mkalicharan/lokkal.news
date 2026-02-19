import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  (() => {
    const connectionString =
      process.env.DATABASE_URL ??
      process.env.POSTGRES_PRISMA_URL ??
      process.env.POSTGRES_URL;

    if (!connectionString) {
      throw new Error(
        'Database connection string is not set. Add DATABASE_URL (or Vercel POSTGRES_PRISMA_URL/POSTGRES_URL).',
      );
    }

    const adapter = new PrismaNeon({ connectionString });

    return new PrismaClient({ adapter });
  })();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}
