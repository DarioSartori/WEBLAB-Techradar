import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { TechnologiesModule } from '../../src/technologies/technologies.module';
import { TechnologiesService } from '../../src/technologies/technologies.service';
import { JwtAuthGuard } from '../../src/common/jwt-auth.guard';
import { RolesGuard } from '../../src/common/roles.guard';

const svcMock = {
  create: jest.fn().mockImplementation(async (dto) => ({
    id: 't1',
    publishedAt: null,
    ...dto,
  })),
  list: jest.fn().mockResolvedValue([]),
  find: jest.fn().mockResolvedValue({ id: 't1' }),
  update: jest.fn().mockResolvedValue({ id: 't1' }),
  publish: jest.fn().mockResolvedValue({
    id: 't1',
    publishedAt: '2025-01-01T00:00:00.000Z',
  }),
  reclassify: jest.fn().mockResolvedValue({
    id: 't1',
    publishedAt: '2025-01-01T00:00:00.000Z',
  }),
};

describe('TechnologiesController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TechnologiesModule],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: () => true })
      .overrideProvider(TechnologiesService)
      .useValue(svcMock)
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /technologies -> 400 on missing required fields', async () => {
    await request(app.getHttpServer())
      .post('/technologies')
      .send({})
      .expect(400);
  });

  it('POST /technologies -> 201 draft create', async () => {
    const res = await request(app.getHttpServer())
      .post('/technologies')
      .send({ name: 'A', category: 'Tools', techDescription: 'desc' })
      .expect(201);
    expect(res.body.publishedAt).toBeNull();
  });

  it('PATCH /technologies/:id/publish requires ring + description and sets publishedAt', async () => {
    await request(app.getHttpServer())
      .patch('/technologies/t1/publish')
      .send({ ring: 'Trial' })
      .expect(400);

    const ok = await request(app.getHttpServer())
      .patch('/technologies/t1/publish')
      .send({ ring: 'Trial', ringDescription: 'why' })
      .expect(200);
    expect(ok.body.publishedAt).toBeTruthy();
  });

  it('PATCH /technologies/:id/reclassify requires ring + description and keeps publishedAt', async () => {
    await request(app.getHttpServer())
      .patch('/technologies/t1/reclassify')
      .send({ ring: 'Adopt' })
      .expect(400);

    const ok = await request(app.getHttpServer())
      .patch('/technologies/t1/reclassify')
      .send({ ring: 'Adopt', ringDescription: 'why' })
      .expect(200);
    expect(ok.body.publishedAt).toBe('2025-01-01T00:00:00.000Z');
  });
});
