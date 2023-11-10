import { PrismaClient } from '@prisma/client';

export const db = new PrismaClient();

export async function checkDbAvailable(): Promise<boolean> {
  try {
    await db.$connect();
    return true;
  } catch (error) {
    return false;
  }
}
