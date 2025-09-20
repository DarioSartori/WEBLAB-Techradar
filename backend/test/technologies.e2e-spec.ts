import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { TechnologiesModule } from '../src/technologies/technologies.module';

const prismaStub = {
  technology: { create: jest.fn().mockResolvedValue({ id: 'uuid', createdAt: new Date() }) },
};

describe('POST /technologies', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TechnologiesModule],
    })
      .overrideProvider('PrismaClient' as any)
      .useValue(prismaStub)
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('201 if payload id valid', async () => {
    await request(app.getHttpServer())
      .post('/technologies')
      .send({
        name: 'ArgoCD',
        category: 'Tools',
        ring: 'Trial',
        techDescription: 'Argo CD is declarative...',
        ringDescription: 'Without making a judgment...',
      })
      .expect(201);
  });

  it('400 if required field missing', async () => {
    await request(app.getHttpServer())
      .post('/technologies')
      .send({
        // name fehlt
        category: 'Tools',
        ring: 'Trial',
        techDescription: '1234567890',
        ringDescription: '1234567890',
      })
      .expect(400);
  });
});
