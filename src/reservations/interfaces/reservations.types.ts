export type ReservationStatus = 'CONFIRMED' | 'CANCELLED';

export type AvailabilityParam = {
  restaurantId: string;
  sectorId: string;
  date: string;
  partySize: number;
};


export type AvailabilityQueryResult = {
    tableId: string;
    tableName: string;
    sectorId: string;
    minSize: number;
    maxSize: number;
    reservationId: number | null;
    customerId: number | null;
    partySize: number | null;
    startDateTimeISO: string | null;
    endDateTimeISO: string | null;
    status: ReservationStatus | null;
}