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

    await prisma.technology.deleteMany({});
    await prisma.technology.create({
      data: {
        name: 'DraftTech',
        category: 'Tools',
        techDescription: 'x',
      },
    });
    await prisma.technology.create({
      data: {
        name: 'PubTech',
        category: 'Tools',
        techDescription: 'x',
        ring: 'Trial',
        ringDescription: 'why',
        publishedAt: new Date('2025-01-01T00:00:00.000Z'),
      },
    });

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
    await request(app.getHttpServer())
      .get('/radar')
      .set(authHeader)
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(1);
        const t = res.body[0];
        expect(t.name).toBe('PubTech');
        expect(t.category).toBe('Tools');
        expect(t.ring).toBe('Trial');
      });
  });
});
