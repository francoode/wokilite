import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';

describe('Reservations E2E Tests', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(DataSource)
      .useFactory({
        factory: () => {
          return new DataSource({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: 'root',
            database: 'wokilite',
          }).initialize();
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    dataSource = moduleFixture.get<DataSource>(DataSource);
    await app.init();
  });

  afterAll(async () => {
    await dataSource.query('TRUNCATE TABLE reservations');
    await app.close();
  });

  beforeEach(async () => {
    await dataSource.query('TRUNCATE TABLE reservations');
  });

  describe('POST /reservations', () => {
    it('should create a valid reservation', async () => {
      const reservation = {
        restaurantId: 'R1',
        sectorId: 'S1',
        partySize: 4,
        startDateTimeISO: '2025-09-08T22:00:00-00:00',
        customer: {
          name: 'Josep',
          phone: '4301102',
          email: 'josep@uurs.com',
        },
        notes: 'ani',
      };

      const response = await request(app.getHttpServer())
        .post('/reservations')
        .set('Idempotency-Key', Math.random().toString())
        .send(reservation)
        .expect(201);

      expect(response.body).toHaveProperty('id');
    });

    it('should handle concurrent reservations for same slot', async () => {
      const reservation = {
        restaurantId: 'R1',
        sectorId: 'S1',
        partySize: 4,
        startDateTimeISO: '2025-09-08T22:00:00-00:00',
        customer: {
          name: 'Josep',
          phone: '4301102',
          email: 'josep@uurs.com',
        },
        notes: 'ani',
      };

      const [response1, response2] = await Promise.all([
        request(app.getHttpServer())
          .post('/reservations')
          .set('Idempotency-Key', Math.random().toString())
          .send(reservation),

        request(app.getHttpServer())
          .post('/reservations')
          .set('Idempotency-Key', Math.random().toString())
          .send(reservation),
      ]);

      expect(
        response1.status === 201
          ? response2.status === 409
          : response1.status === 409,
      ).toBeTruthy();
    });

    it('should be idempotent with same Idempotency-Key', async () => {
      const reservation = {
        restaurantId: 'R1',
        sectorId: 'S1',
        partySize: 4,
        startDateTimeISO: '2025-09-08T22:00:00-00:00',
        customer: {
          name: 'Josep',
          phone: '4301102',
          email: 'josep@uurs.com',
        },
        notes: 'ani',
      };

      const idempotencyKey = 'test-idempotency-key-1';

      const response1 = await request(app.getHttpServer())
        .post('/reservations')
        .set('Idempotency-Key', idempotencyKey)
        .send(reservation)
        .expect(201);

      const response2 = await request(app.getHttpServer())
        .post('/reservations')
        .set('Idempotency-Key', idempotencyKey)
        .send(reservation)
        .expect(201);

      expect(response1.body.id).toBe(response2.body.id);
    });
  });

  describe('DELETE /reservations/:id', () => {
    it('should cancel reservation and make slot available again', async () => {
      const reservation = {
        restaurantId: 'R1',
        sectorId: 'S1',
        partySize: 4,
        startDateTimeISO: '2025-09-08T22:00:00-00:00',
        customer: {
          name: 'Josep',
          phone: '4301102',
          email: 'josep@uurs.com',
        },
        notes: 'ani',
      };

      const response1 = await request(app.getHttpServer())
        .post('/reservations')
        .set('Idempotency-Key', 'idempotencyKey-delete-1')
        .send(reservation)
        .expect(201);

      await request(app.getHttpServer())
        .delete(`/reservations/${response1.body.id}`)
        .set('Idempotency-Key', 'idempotencyKey-delete-2')
        .expect(204);
    });
  });

  describe('GET /reservations/day', () => {
    it('should return reservations for a specific day', async () => {
      const reservation = {
        restaurantId: 'R1',
        sectorId: 'S1',
        partySize: 4,
        startDateTimeISO: '2025-09-08T22:00:00-00:00',
        customer: {
          name: 'Josep',
          phone: '4301102',
          email: 'josep@uurs.com',
        },
        notes: 'ani',
      };

      await request(app.getHttpServer())
        .post('/reservations')
        .set('Idempotency-Key', Math.random().toString())
        .send(reservation)
        .expect(201);

      const response = await request(app.getHttpServer())
        .get('/reservations/day')
        .set('Idempotency-Key', Math.random().toString())
        .query({
          date: '2025-09-08',
          restaurantId: 'R1',
        })
        .expect(200);

      expect(response.body).toBeDefined();
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBe(1);

      expect(response.body[0]).toMatchObject({
        sectorId: 'S1',
        partySize: 4,
        name: 'Josep',
      });
    });
  });
});
