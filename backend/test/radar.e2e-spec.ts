import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { RadarModule } from '../src/radar/radar.module';

const prismaStub = {
  technology: {
    findMany: jest.fn().mockResolvedValue([
      { id:'1', name:'ArgoCD', category:'Tools', ring:'Trial' },
      { id:'2', name:'Kubernetes', category:'Platforms', ring:'Adopt' },
    ]),
  },
};

describe('GET /radar', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const m = await Test.createTestingModule({ imports: [RadarModule] })
      .overrideProvider((global as any).PrismaClient ?? class {})
      .useValue(prismaStub as any)
      .compile();

    app = m.createNestApplication();
    await app.init();
  });

  afterAll(async () => { await app.close(); });

  it('only delivers published technologies', async () => {
    await request(app.getHttpServer())
      .get('/radar')
      .expect(200)
      .expect(res => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.every((t: any) => t.id && t.category && t.ring)).toBe(true);
      });
  });
});
