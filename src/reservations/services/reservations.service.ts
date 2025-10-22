import { Injectable } from '@nestjs/common';
import { AvailabilityParam } from '../interfaces/reservations.types';

@Injectable()
export class ReservationsService {
  checkAvailability = async (params: AvailabilityParam) => {
    
  };
}
