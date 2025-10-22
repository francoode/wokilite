import { Injectable } from '@nestjs/common';
import { AvailabilityParam } from '../interfaces/reservations.types';

@Injectable()
export class ReservationsRepository {
  getAvailability = async (params: AvailabilityParam) => {
    const { date, partySize, restaurantId, sectorId } = params;

    const results = await AppDataSource.query(
    `
        SELECT * 
        FROM restaurants rest
        JOIN sector sec on sec.restaurantId = rest.id
        JOIN tables tab on tab.sectorId = sec.id
        LEFT JOIN reservations r ON r.tableId = tab.id
        WHERE
        rest.id = $1 AND 
        sec.id = $2 AND 
        (DATE(r.startDateTimeISO) = $3 OR r.id IS NULL) AND
        minSize >= $4 AND
        maxSize <= $5
    `,
      [restaurantId, sectorId, date, partySize, partySize],
    );
  };
}
