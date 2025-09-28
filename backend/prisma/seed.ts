import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
const prisma = new PrismaClient();
async function run() {
  const hash = await bcrypt.hash('12345678', 10);
  await prisma.user.upsert({
    where: { email: 'cto@example.com' },
    update: {},
    create: { email: 'cto@example.com', passwordHash: hash, role: 'CTO' },
  });
  await prisma.user.upsert({
    where: { email: 'emp@example.com' },
    update: {},
    create: { email: 'emp@example.com', passwordHash: hash, role: 'EMPLOYEE' },
  });
}
run().finally(()=>prisma.$disconnect());
