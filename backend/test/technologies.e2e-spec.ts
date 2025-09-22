import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { TechnologiesController } from '../src/technologies/technologies.controller';
import { TechnologiesService } from '../src/technologies/technologies.service';

describe('TechnologiesController', () => {
  let app: INestApplication;
  const service = {
    create: jest.fn().mockResolvedValue({ id: '1' }),
    publish: jest
      .fn()
      .mockResolvedValue({ id: '1', publishedAt: new Date().toISOString() }),
  } as Partial<TechnologiesService>;

  beforeAll(async () => {
    const mod = await Test.createTestingModule({
      controllers: [TechnologiesController],
      providers: [{ provide: TechnologiesService, useValue: service }],
    }).compile();

    app = mod.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => app.close());

  it('POST /technologies -> 201 (Draft, ring optional)', async () => {
    await request(app.getHttpServer())
      .post('/technologies')
      .send({ name: 'X', category: 'Tools', techDescription: 'desc' })
      .expect(201);
  });

  it('POST /technologies -> 400 if required field missing', async () => {
    await request(app.getHttpServer())
      .post('/technologies')
      .send({ category: 'Tools', techDescription: 'desc' })
      .expect(400);
  });

  it('PATCH /technologies/:id/publish -> 400 if required fields missing', async () => {
    await request(app.getHttpServer())
      .patch('/technologies/1/publish')
      .send({ ring: 'Trial' })
      .expect(400);
  });

  it('PATCH /technologies/:id/publish -> 200 with  ring + ringDescription', async () => {
    await request(app.getHttpServer())
      .patch('/technologies/1/publish')
      .send({ ring: 'Trial', ringDescription: 'Description' })
      .expect(200);
  });
});
