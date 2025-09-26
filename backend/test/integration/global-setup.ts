import * as path from 'node:path';
import * as dotenv from 'dotenv';
import { execSync } from 'node:child_process';

export default async () => {
  const envPath = path.resolve(__dirname, '../../.env.test');
  dotenv.config({ path: envPath });

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL missing (backend/.env.test)');
  }

  execSync('npx prisma migrate reset --force --skip-seed', {
    stdio: 'inherit',
    env: { ...process.env },
  });
};
