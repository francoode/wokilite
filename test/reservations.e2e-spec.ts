import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { DataSource } from 'typeorm';
import { AppModule } from '../src/app.module';

describe('Reservations E2E Tests', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    console.log(process.env.TZ);
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

    /* it('should allow adjacent reservations at end-exclusive times', async () => {
      // Arrange
      const now = new Date();
      const firstReservation = {
        restaurantId: 1,
        tableId: 1,
        sectorId: 1,
        startDateTimeISO: now.toISOString(),
        endDateTimeISO: new Date(now.getTime() + 3600000).toISOString(),
      };

      const secondReservation = {
        ...firstReservation,
        startDateTimeISO: firstReservation.endDateTimeISO,
        endDateTimeISO: new Date(now.getTime() + 7200000).toISOString(),
      };

      // Act & Assert
      await request(app.getHttpServer())
        .post('/reservations')
        .send(firstReservation)
        .expect(201);

      await request(app.getHttpServer())
        .post('/reservations')
        .send(secondReservation)
        .expect(201);
    }); */

    /* it('should reject reservations outside shift hours', async () => {
      // Arrange
      const outsideShiftReservation = {
        restaurantId: 1,
        tableId: 1,
        sectorId: 1,
        startDateTimeISO: new Date('2025-10-24T03:00:00Z').toISOString(), // Assuming this is outside shift
        endDateTimeISO: new Date('2025-10-24T04:00:00Z').toISOString(),
      };

      // Act & Assert
      await request(app.getHttpServer())
        .post('/reservations')
        .send(outsideShiftReservation)
        .expect(422);
    }); */

    /*  it('should be idempotent with same Idempotency-Key', async () => {
      // Arrange
      const reservation = {
        restaurantId: 1,
        tableId: 1,
        sectorId: 1,
        startDateTimeISO: new Date().toISOString(),
        endDateTimeISO: new Date(Date.now() + 3600000).toISOString(),
      };

      const idempotencyKey = 'test-idempotency-key-1';

      // Act
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
    }); */
  });

  /* describe('DELETE /reservations/:id', () => {
    it('should cancel reservation and make slot available again', async () => {
      // Arrange
      const reservation = {
        restaurantId: 1,
        tableId: 1,
        sectorId: 1,
        startDateTimeISO: new Date().toISOString(),
        endDateTimeISO: new Date(Date.now() + 3600000).toISOString(),
      };

      const createResponse = await request(app.getHttpServer())
        .post('/reservations')
        .send(reservation);

      // Act
      await request(app.getHttpServer())
        .delete(`/reservations/${createResponse.body.id}`)
        .expect(204);

      // Assert - Verify slot is available again
      const checkSlot = await request(app.getHttpServer())
        .get(
          `/reservations/availability?tableId=${reservation.tableId}&startDateTime=${reservation.startDateTimeISO}`,
        )
        .expect(200);

      expect(checkSlot.body.available).toBeTruthy();
    });
  }); */

  /* describe('GET /reservations/daily', () => {
    it('should return correct reservations with and without sectorId', async () => {
      // Arrange
      const reservation1 = {
        restaurantId: 1,
        tableId: 1,
        sectorId: 1,
        startDateTimeISO: new Date().toISOString(),
        endDateTimeISO: new Date(Date.now() + 3600000).toISOString(),
      };

      const reservation2 = {
        ...reservation1,
        sectorId: 2,
        tableId: 2,
      };

      await request(app.getHttpServer())
        .post('/reservations')
        .send(reservation1);

      await request(app.getHttpServer())
        .post('/reservations')
        .send(reservation2);

      // Act & Assert - Without sectorId
      const allReservations = await request(app.getHttpServer())
        .get('/reservations/daily')
        .query({ date: new Date().toISOString().split('T')[0] })
        .expect(200);

      expect(allReservations.body).toHaveLength(2);

      // Act & Assert - With sectorId
      const sectorReservations = await request(app.getHttpServer())
        .get('/reservations/daily')
        .query({
          date: new Date().toISOString().split('T')[0],
          sectorId: 1,
        })
        .expect(200);

      expect(sectorReservations.body).toHaveLength(1);
    });
  });

  describe('Timestamps', () => {
    it('should set and update timestamps correctly', async () => {
      // Arrange
      const reservation = {
        restaurantId: 1,
        tableId: 1,
        sectorId: 1,
        startDateTimeISO: new Date().toISOString(),
        endDateTimeISO: new Date(Date.now() + 3600000).toISOString(),
      };

      // Act - Create
      const createResponse = await request(app.getHttpServer())
        .post('/reservations')
        .send(reservation)
        .expect(201);

      // Assert - Create
      expect(createResponse.body.createdAt).toBeDefined();
      expect(createResponse.body.updatedAt).toBeDefined();
      expect(createResponse.body.createdAt).toBe(createResponse.body.updatedAt);

      // Act - Cancel
      await request(app.getHttpServer())
        .delete(`/reservations/${createResponse.body.id}`)
        .expect(204);

      // Assert - Get after cancel
      const cancelledReservation = await request(app.getHttpServer())
        .get(`/reservations/\${createResponse.body.id}`)
        .expect(200);

      expect(cancelledReservation.body.updatedAt).not.toBe(
        cancelledReservation.body.createdAt,
      );
    });
  }); */
});
