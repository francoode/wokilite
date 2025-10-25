import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  AvailabilityParam,
  AvailabilityQueryResult,
} from '../interfaces/reservations.types';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Reservation } from '../entities/reservation.entity';

@Injectable()
export class ReservationsRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

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
        LEFT JOIN reservations r 
          ON t.id = r.tableId
          AND DATE(r.startDateTimeISO) = ?
        WHERE t.sectorId = ?
        AND t.minSize <= ?
        AND t.maxSize >= ?
    `,
      [date, sectorId, partySize, partySize],
    );

    return results;
  };

  create = async (data: {
    restaurantId: string;
    sectorId: string;
    customerId: string;
    partySize: number;
    tableId: string;
    startDateTimeISO: string;
    endDateTimeISO: string;
    notes?: string;
  }): Promise<Reservation> => {
    const {
      restaurantId,
      sectorId,
      partySize,
      tableId,
      startDateTimeISO,
      endDateTimeISO,
      customerId,
      notes,
    } = data;

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      //Bloqueo la fila de la tabla para evitar double booking
      const existing = await queryRunner.query(
        `
        SELECT id FROM reservations
        WHERE sectorId = ? AND startDateTimeISO = ? AND status = 'CONFIRMED' AND tableId = ?
        FOR UPDATE
      `,
        [sectorId, startDateTimeISO, tableId],
      );

      if (existing.length > 0)
        throw new ConflictException('Slot already booked');

      const result = await queryRunner.query(
        `
        INSERT INTO reservations (restaurantId, sectorId, customerId, startDateTimeISO, endDateTimeISO, partySize, tableId, status, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
        [
          restaurantId,
          sectorId,
          customerId,
          startDateTimeISO,
          endDateTimeISO,
          partySize,
          tableId,
          'CONFIRMED',
          notes
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
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
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
    date: string,
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
