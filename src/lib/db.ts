import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

let prisma: PrismaClient

const getConnectionString = () => {
  // Fallback to a placeholder URL during static rendering/builds if DATABASE_URL is not set
  return process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/postgres'
}

if (process.env.NODE_ENV === 'production') {
  const pool = new Pool({ connectionString: getConnectionString() })
  const adapter = new PrismaPg(pool)
  prisma = new PrismaClient({ adapter })
} else {
  if (!globalForPrisma.prisma) {
    const pool = new Pool({ connectionString: getConnectionString() })
    const adapter = new PrismaPg(pool)
    globalForPrisma.prisma = new PrismaClient({ adapter })
  }
  prisma = globalForPrisma.prisma
}

export { prisma }
