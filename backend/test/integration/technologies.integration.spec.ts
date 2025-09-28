import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import * as jwt from 'jsonwebtoken';
import { AppModule } from '../../src/app.module';
import { PrismaClient } from '@prisma/client';

describe('Technologies Integration', () => {
  let app: INestApplication;
  let prisma: PrismaClient;
  let authHeader: { Authorization: string };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();

    prisma = moduleRef.get(PrismaClient);

    const secret = process.env.JWT_SECRET || 'dev-secret';
    const token = jwt.sign({ sub: 'test-user', email: 'cto@test.local', role: 'CTO' }, secret, { expiresIn: '1h' });
    authHeader = { Authorization: `Bearer ${token}` };

    await prisma.technology.deleteMany({});
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  it('flow: create draft -> publish -> reclassify', async () => {
    const http = request(app.getHttpServer());

    const create = await http
      .post('/technologies')
      .set(authHeader)
      .send({ name: 'Kubernetes', category: 'Platforms', techDescription: 'desc' })
      .expect(201);

    const id = create.body.id;
    expect(create.body.publishedAt).toBeNull();

    const published = await http
      .patch(`/technologies/${id}/publish`)
      .set(authHeader)
      .send({ ring: 'Trial', ringDescription: 'why' })
      .expect(200);
    expect(published.body.publishedAt).toBeTruthy();

    const reclassified = await http
      .patch(`/technologies/${id}/reclassify`)
      .set(authHeader)
      .send({ ring: 'Adopt', ringDescription: 'better now' })
      .expect(200);
    expect(reclassified.body.publishedAt).toBeTruthy();
  });
});
