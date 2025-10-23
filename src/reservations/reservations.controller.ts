import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ReservationsService } from './services/reservations.service';
import { AvailabilityDto } from './dtos/availability.dto';

@Controller('')
export class ReservationsController {

  @Inject() reservationsService: ReservationsService;
  
  @Get('availability')
  async checkAvailability(
    @Query() query: AvailabilityDto
  ) {
    return this.reservationsService.checkAvailability(query);
  }
}
