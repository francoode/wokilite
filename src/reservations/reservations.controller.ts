import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ReservationsService } from './services/reservations.service';
import { AvailabilityDto } from './dtos/availability.dto';
import { CreateReservationDto } from './dtos/create-reservation.dto';
import { DailyReservationsQueryDto } from './dtos/daily-reservation.dto';

@Controller('')
export class ReservationsController {
  @Inject() reservationsService: ReservationsService;

  @Get('availability')
  async checkAvailability(@Query() query: AvailabilityDto) {
    return this.reservationsService.getSectorStatus(query);
  }

  @Post('reservations')
  async create(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationsService.create(createReservationDto);
  }

  @Delete('reservations/:id')
  async cancel(@Param('id') id: string) {
    return this.reservationsService.cancel(id);
  }

  @Get('/reservations/day')
  getDailyReservations(@Query() query: DailyReservationsQueryDto) {
    const { restaurantId, date, sectorId } = query;
/*     return this.reservationsService.findDailyReservations(
      restaurantId,
      date,
      sectorId,
    ); */
  }
}
