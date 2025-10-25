import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Inject,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ReservationsService } from './services/reservations.service';
import { AvailabilityDto } from './dtos/availability.dto';
import { CreateReservationDto } from './dtos/create-reservation.dto';
import { DailyReservationsQueryDto } from './dtos/daily-reservation.dto';
import { RequestCollector } from 'src/shared/service/request-idempotency.service';

@Controller('')
export class ReservationsController {
  @Inject() reservationsService: ReservationsService;
  @Inject() reqCollector: RequestCollector;

  @Get('availability')
  async checkAvailability(
    @Query() query: AvailabilityDto,
    @Headers('Idempotency-Key') idempotencyKey: string,
  ) {
    const cachedResponse = this.reqCollector.executeIdempotent(idempotencyKey);
    if (cachedResponse) return cachedResponse;

    return await this.reservationsService.getSectorStatus(query);
  }

  @Post('reservations')
  async create(
    @Body() createReservationDto: CreateReservationDto,
    @Headers('Idempotency-Key') idempotencyKey: string,
  ) {
    const cachedResponse = this.reqCollector.executeIdempotent(idempotencyKey);
    if (cachedResponse) return cachedResponse;

    return await this.reservationsService.create(createReservationDto);
  }

  @Delete('reservations/:id')
  async cancel(
    @Param('id') id: string,
    @Headers('Idempotency-Key') idempotencyKey: string,
  ) {
    const cachedResponse = this.reqCollector.executeIdempotent(idempotencyKey);
    if (cachedResponse) return cachedResponse;

    return await this.reservationsService.cancel(id);
  }

  @Get('/reservations/day')
  async getDailyReservations(
    @Query() query: DailyReservationsQueryDto,
    @Headers('Idempotency-Key') idempotencyKey: string,
  ) {
    const cachedResponse = this.reqCollector.executeIdempotent(idempotencyKey);
    if (cachedResponse) return cachedResponse;

    const { restaurantId, date, sectorId } = query;
    return await this.reservationsService.getDailyReservations(query);
  }
}
