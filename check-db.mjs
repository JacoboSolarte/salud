import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const n = await prisma.incidentReport.count();
    console.log('incidentReport count:', n);
  } catch (err) {
    console.error('Error querying DB:', err);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
