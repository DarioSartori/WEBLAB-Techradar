import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { TechnologiesController } from '../../src/technologies/technologies.controller';
import { TechnologiesService } from '../../src/technologies/technologies.service';

describe('TechnologiesController (e2e, mocked service)', () => {
  let app: INestApplication;
  const nowIso = new Date().toISOString();

  const mockService = {
    create: jest.fn(async (dto: any) => ({
      id: 't1',
      publishedAt: null,
      updatedAt: nowIso,
      createdAt: nowIso,
      ...dto,
    })),
    list: jest.fn(async (_status?: any) => []),
    find: jest.fn(async (id: string) => ({ id })),
    update: jest.fn(async (_id: string, dto: any) => ({
      id: 't1',
      updatedAt: new Date().toISOString(),
      ...dto,
    })),
    publish: jest.fn(async (_id: string, ring: any, ringDescription: string) => ({
      id: 't1',
      ring,
      ringDescription,
      publishedAt: nowIso,
      updatedAt: new Date().toISOString(),
    })),
    reclassify: jest.fn(async (_id: string, ring: any, ringDescription: string) => ({
      id: 't1',
      ring,
      ringDescription,
      publishedAt: '2025-01-01T00:00:00.000Z',
      updatedAt: new Date().toISOString(),
    })),
  } as unknown as TechnologiesService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [TechnologiesController],
      providers: [{ provide: TechnologiesService, useValue: mockService }],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();
  });

  afterAll(async () => { await app.close(); });

  it('POST /technologies -> 400 on missing required fields', async () => {
    await request(app.getHttpServer()).post('/technologies').send({}).expect(400);
  });

  it('POST /technologies -> 201 draft create', async () => {
    const res = await request(app.getHttpServer()).post('/technologies')
      .send({ name: 'A', category: 'Tools', techDescription: 'desc' }).expect(201);
    expect(res.body.publishedAt).toBeNull();
  });

  it('PATCH /technologies/:id/publish requires ring + description and sets publishedAt', async () => {
    await request(app.getHttpServer()).patch('/technologies/t1/publish').send({ ring: 'Trial' }).expect(400);
    const ok = await request(app.getHttpServer()).patch('/technologies/t1/publish')
      .send({ ring: 'Trial', ringDescription: 'why' }).expect(200);
    expect(ok.body.publishedAt).toBeTruthy();
  });

  it('PATCH /technologies/:id/reclassify requires ring + description and keeps publishedAt', async () => {
    await request(app.getHttpServer()).patch('/technologies/t1/reclassify').send({ ring: 'Adopt' }).expect(400);
    const ok = await request(app.getHttpServer()).patch('/technologies/t1/reclassify')
      .send({ ring: 'Adopt', ringDescription: 'why' }).expect(200);
    expect(ok.body.publishedAt).toBe('2025-01-01T00:00:00.000Z');
  });
});
