import { ISODateTime, ReservationStatus } from 'src/shared/types';
import { Customer } from './customer.entity';

export class Reservation {
  id: string;
  restaurantId: string;
  sectorId: string;
  tableIds: string[];                              // CORE: single table; BONUS: combinations
  partySize: number;
  startDateTimeISO: ISODateTime;
  endDateTimeISO: ISODateTime;
  status: ReservationStatus;                       // CORE uses CONFIRMED | CANCELLED
  customer: Customer;
  notes?: string;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}
