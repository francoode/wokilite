import { Injectable } from '@nestjs/common';
import {
  AvailabilityParam,
  AvailabilityQueryResult,
} from '../interfaces/reservations.types';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Reservation } from '../entities/reservation.entity';
import { Table } from '../entities/table.entity';
import { Restaurant } from '../entities/restaurant.entity';
import { Customer } from '../entities/customer.entity';

@Injectable()
export class ReservationsRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  //@TODO deberia ir en restaurante
  getSectorStatusByPartySize = async (
    params: AvailabilityParam,
  ): Promise<AvailabilityQueryResult[]> => {
    const { date, partySize, restaurantId, sectorId } = params;

    const results = await this.dataSource.query(
      `
        SELECT 
          t.id AS tableId,
          t.name AS tableName,
          t.sectorId,
          t.minSize,
          t.maxSize,
          r.id AS reservationId,
          r.customerId,
          r.partySize,
          r.startDateTimeISO,
          r.endDateTimeISO,
          r.status
        FROM tables t
        LEFT JOIN reservations r ON t.id = r.tableId
        WHERE t.sectorId = ?
        AND t.minSize <= ?
        AND t.maxSize >= ?;  
    `,
      [sectorId, partySize, partySize],
    );

    return results;
  };

  getRestaurantById = async (
    restaurantId: string,
  ): Promise<Restaurant | null> => {
    const restaurant = await this.dataSource.query(
      `
      SELECT *
      FROM restaurants
      WHERE id = ?;
    `,
      [restaurantId],
    );
    return restaurant[0] || null;
  };

  create = async (
    data: Partial<Reservation>,
    customer: Customer,
    table: Table,
  ): Promise<Reservation> => {
    const {
      restaurantId,
      sectorId,
      startDateTimeISO,
      endDateTimeISO,
      partySize,
    } = data;

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1️⃣ Buscar si existe reserva (bloquea si hay una fila o un hueco)
      const existing = await queryRunner.query(
        `
        SELECT id FROM reservations
        WHERE sectorId = ? AND startDateTimeISO = ?
        FOR UPDATE
      `,
        [sectorId, startDateTimeISO],
      );

      if (existing.length > 0) {
        throw new Error('Slot already booked');
      }

      // 2️⃣ Crear la reserva
      const result = await queryRunner.query(
        `
        INSERT INTO reservations (restaurantId, sectorId, customerId, startDateTimeISO, endDateTimeISO, partySize)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
        [
          restaurantId,
          sectorId,
          customer.id,
          startDateTimeISO,
          endDateTimeISO,
          partySize,
        ],
      );

      const [reservation] = await queryRunner.query(
        `
        SELECT *
        FROM reservations r
        WHERE r.id = ?
      `,
        [result.insertId],
      );

      await queryRunner.commitTransaction();

      return reservation;
    } catch (error) {
      // 4️⃣ Si hay error, revertir
      await queryRunner.rollbackTransaction();
      console.error('Error creating reservation:', error.message);
      throw error;
    } finally {
      // 5️⃣ Liberar el runner
      await queryRunner.release();
    }
  };

  cancel = async (id: string) => {
    const result = await this.dataSource.query(
      `
      UPDATE reservations
      SET status = 'CANCELLED'
      WHERE id = ?;
    `,
      [id],
    );
    return result;
  };

  async findDailyReservations(
    restaurantId: string,
    date: string, // formato YYYY-MM-DD
    sectorId?: string,
  ) {
    const reservations = await this.dataSource.query(
      `
  SELECT *
  FROM reservations r
  JOIN customers c ON c.id = r.customerId
  WHERE r.restaurantId = ?
    AND DATE(r.startDateTimeISO) = ?
    ${sectorId ? 'AND r.sectorId = ?' : 'AND true'}
  ORDER BY r.startDateTimeISO;
  `,
      [restaurantId, date, sectorId || null],
    );

    return reservations;
  }
}
