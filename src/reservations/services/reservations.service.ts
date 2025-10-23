import { Inject, Injectable } from '@nestjs/common';
import { AvailabilityParam } from '../interfaces/reservations.types';
import { ReservationsRepository } from '../repositories/reservations.repository';
import { Slot } from 'src/shared/slot';

@Injectable()
export class ReservationsService {
  @Inject() reservationsRepository: ReservationsRepository;

  checkAvailability = async (params: AvailabilityParam) => {
    const restaurant = await this.reservationsRepository.getRestaurantById(
      params.restaurantId,
    );
    
    if (!restaurant) {
      throw new Error('Restaurant not found');
    }

    const reservations =
      await this.reservationsRepository.getAvailabilities(params);

    

    return Slot.getSlots(restaurant.shifts || [], restaurant.timezone);
  };

  manageTable = () => {
    
  }
}
