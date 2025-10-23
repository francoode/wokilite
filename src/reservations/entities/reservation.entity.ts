import { ISODateTime } from 'src/shared/types';
import { Customer } from './customer.entity';
import { ReservationStatus } from '../interfaces/reservations.types';

export class Reservation {
  id: string;
  restaurantId: string;
  sectorId: string;
  tableId: string;                        
  partySize: number;
  startDateTimeISO: ISODateTime;
  endDateTimeISO: ISODateTime;
  status: ReservationStatus;
  customer: Customer;
  notes?: string;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}
