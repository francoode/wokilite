import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ReservationsService } from './services/reservations.service';

@Controller('')
export class ReservationsController {

  @Inject() reservationsService: ReservationsService;
  

  @Get('availability')
  async checkAvailability(
    @Query('restaurantId') restaurantId: string,
    @Query('sectorId') sectorId: string,
    @Query('date') date: string,
    @Query('partySize') partySize: number,
  ) {
    return this.reservationsService.checkAvailability({
      restaurantId,
      sectorId,
      date,
      partySize,
    });
  }
}
