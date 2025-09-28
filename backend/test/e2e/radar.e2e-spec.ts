import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import * as jwt from 'jsonwebtoken';
import { AppModule } from '../../src/app.module';
import { PrismaClient } from '@prisma/client';

describe('GET /radar', () => {
  let app: INestApplication;
  let prisma: PrismaClient;
  let authHeader: { Authorization: string };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    await app.init();

    prisma = moduleRef.get(PrismaClient);

    const secret = process.env.JWT_SECRET || 'dev-secret';
    const token = jwt.sign(
      { sub: 'viewer', email: 'emp@test.local', role: 'EMPLOYEE' },
      secret,
      { expiresIn: '1h' },
    );
    authHeader = { Authorization: `Bearer ${token}` };
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  it('only delivers published technologies', async () => {
    const ts = Date.now();
    const draftName = `DraftTech-${ts}`;
    const pubName = `PubTech-${ts}`;

    await prisma.technology.create({
      data: {
        name: draftName,
        category: 'Tools',
        techDescription: 'x',
      },
    });

    await prisma.technology.create({
      data: {
        name: pubName,
        category: 'Tools',
        techDescription: 'x',
        ring: 'Trial',
        ringDescription: 'why',
        publishedAt: new Date('2025-01-01T00:00:00.000Z'),
      },
    });

    const res = await request(app.getHttpServer())
      .get('/radar')
      .set(authHeader)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);

    const names = (res.body as any[]).map((t) => t.name);
    expect(names).toContain(pubName);
    expect(names).not.toContain(draftName);

    const pub = (res.body as any[]).find((t) => t.name === pubName);
    expect(pub).toMatchObject({ category: 'Tools', ring: 'Trial' });
  });
});
