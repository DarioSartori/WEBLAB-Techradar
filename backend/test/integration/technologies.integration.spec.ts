import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { TechnologiesController } from '../../src/technologies/technologies.controller';
import { TechnologiesService } from '../../src/technologies/technologies.service';
import { PrismaClient } from '@prisma/client';
import { Ring } from '../../src/technologies/dto/ring.enum';

describe('Technologies Integration (real Prisma)', () => {
  let app: INestApplication;
  let prisma: PrismaClient;

  beforeAll(async () => {
    prisma = new PrismaClient();
    const moduleRef = await Test.createTestingModule({
      controllers: [TechnologiesController],
      providers: [
        TechnologiesService,
        { provide: PrismaClient, useValue: prisma },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  it('flow: create draft -> publish -> reclassify', async () => {
    const http = request(app.getHttpServer());

    const create = await http.post('/technologies').send({
      name: 'Kubernetes', category: 'Platforms', techDescription: 'desc',
    }).expect(201);

    const id = create.body.id;
    expect(create.body.publishedAt).toBeNull();

    const pub = await http.patch(`/technologies/${id}/publish`).send({
      ring: Ring.Trial, ringDescription: 'initial',
    }).expect(200);

    expect(pub.body.publishedAt).toBeTruthy();
    
    const before = pub.body.publishedAt;
    const rec = await http.patch(`/technologies/${id}/reclassify`).send({
      ring: Ring.Adopt, ringDescription: 'mature',
    }).expect(200);

    expect(rec.body.ring).toBe(Ring.Adopt);
    expect(rec.body.publishedAt).toBe(before);
  });
});
