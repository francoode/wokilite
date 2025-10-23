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
}
