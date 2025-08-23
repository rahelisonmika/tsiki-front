import { PrismaClient } from '@/lib/generated/prisma';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['error', 'warn'], // ajoute 'query' en debug si besoin
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;