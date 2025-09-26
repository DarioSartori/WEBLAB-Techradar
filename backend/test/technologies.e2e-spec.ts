import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { TechnologiesController } from '../src/technologies/technologies.controller';
import { TechnologiesService } from '../src/technologies/technologies.service';

describe('TechnologiesController', () => {
  let app: INestApplication;

  const nowIso = new Date().toISOString();
  const mockService = {
    create: jest.fn().mockImplementation((dto) => ({
      id: 't1',
      ...dto,
      createdAt: nowIso,
      updatedAt: nowIso,
      publishedAt: null,
    })),
    list: jest.fn().mockResolvedValue([]),
    find: jest.fn().mockResolvedValue({ id: 't1' }),
    update: jest.fn().mockImplementation((_id, dto) => ({
      id: 't1',
      ...dto,
      updatedAt: new Date().toISOString(),
    })),
    publish: jest.fn().mockImplementation((_id, ring, ringDescription) => ({
      id: 't1',
      ring,
      ringDescription,
      publishedAt: nowIso,
      updatedAt: new Date().toISOString(),
    })),
    reclassify: jest
      .fn()
      .mockImplementation((_id, ring, ringDescription) => ({
        id: 't1',
        ring,
        ringDescription,
        publishedAt: '2025-01-01T00:00:00.000Z',
        updatedAt: new Date().toISOString(),
      })),
  } as Partial<TechnologiesService>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [TechnologiesController],
      providers: [{ provide: TechnologiesService, useValue: mockService }],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /technologies -> 400 if required fields are missing', async () => {
    await request(app.getHttpServer())
      .post('/technologies')
      .send({ name: '', category: '', techDescription: '' })
      .expect(400);
  });

  it('POST /technologies -> 201 Draft without classification', async () => {
    const res = await request(app.getHttpServer())
      .post('/technologies')
      .send({ name: 'A', category: 'Tools', techDescription: 'desc' })
      .expect(201);
    expect(res.body.name).toBe('A');
    expect(res.body.publishedAt).toBeNull();
  });

  it('PATCH /technologies/:id/publish -> 400 if fields missing', async () => {
    await request(app.getHttpServer())
      .patch('/technologies/t1/publish')
      .send({ ring: 'Trial' })
      .expect(400);
  });

  it('PATCH /technologies/:id/publish -> 200 sets publishedAt', async () => {
    const res = await request(app.getHttpServer())
      .patch('/technologies/t1/publish')
      .send({ ring: 'Trial', ringDescription: 'Initial' })
      .expect(200);
    expect(res.body.publishedAt).toBeTruthy();
    expect(res.body.ring).toBe('Trial');
  });

  it('PATCH /technologies/:id/reclassify -> 400 if fields missing', async () => {
    await request(app.getHttpServer())
      .patch('/technologies/t1/reclassify')
      .send({ ring: 'Adopt' })
      .expect(400);
  });

  it('PATCH /technologies/:id/reclassify -> 200 changes Ring, publishedAt doesnt change', async () => {
    const before = '2025-01-01T00:00:00.000Z';
    const res = await request(app.getHttpServer())
      .patch('/technologies/t1/reclassify')
      .send({ ring: 'Adopt', ringDescription: 'Updated' })
      .expect(200);
    expect(res.body.ring).toBe('Adopt');
    expect(res.body.ringDescription).toBe('Updated');
    expect(res.body.publishedAt).toBe(before);
  });
});
