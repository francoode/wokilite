import { Customer } from '../../customers/entities/customer.entity';
import { ReservationStatus } from '../interfaces/reservations.types';

export class Reservation {
  id: string;
  restaurantId: string;
  sectorId: string;
  tableId: string;                        
  partySize: number;
  startDateTimeISO: string;
  endDateTimeISO: string;
  status: ReservationStatus;
  customer: Customer;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
