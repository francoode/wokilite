import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  Inject,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ReservationsService } from './services/reservations.service';
import { AvailabilityDto } from './dtos/availability.dto';
import { CreateReservationDto } from './dtos/create-reservation.dto';
import { DailyReservationsQueryDto } from './dtos/daily-reservation.dto';
import { RequestCollector } from '../shared/service/request-idempotency.service';

@Controller('')
export class ReservationsController {
  @Inject() reservationsService: ReservationsService;
  @Inject() reqCollector: RequestCollector;

  @Get('availability')
  async checkAvailability(
    @Query() query: AvailabilityDto,
    @Headers('Idempotency-Key') idempotencyKey: string,
  ) {
    try {
      const cachedResponse =
        this.reqCollector.executeIdempotent(idempotencyKey);
      if (cachedResponse) return cachedResponse;

      const response = await this.reservationsService.getSectorStatus(query);
      this.reqCollector.endRequest(idempotencyKey, response);
      return response;
    } catch (e) {
      this.reqCollector.endRequest(idempotencyKey, null);
      throw e;
    }
  }

  @Post('reservations')
  async create(
    @Body() createReservationDto: CreateReservationDto,
    @Headers('Idempotency-Key') idempotencyKey: string,
  ) {
    try {
      const cachedResponse =
        this.reqCollector.executeIdempotent(idempotencyKey);
      if (cachedResponse) return cachedResponse;

      const response =
        await this.reservationsService.create(createReservationDto);
      this.reqCollector.endRequest(idempotencyKey, response);
      return response;
    } catch (e) {
      this.reqCollector.endRequest(idempotencyKey, null);
      throw e;
    }
  }

  @Delete('reservations/:id')
  @HttpCode(204)
  async cancel(
    @Param('id') id: string,
    @Headers('Idempotency-Key') idempotencyKey: string,
  ) {
    try {
      const cachedResponse =
        this.reqCollector.executeIdempotent(idempotencyKey);
      if (cachedResponse) return cachedResponse;

      const response = await this.reservationsService.cancel(id);
      this.reqCollector.endRequest(idempotencyKey, response);
      return response;
    } catch (e) {
      this.reqCollector.endRequest(idempotencyKey, null);
      throw e;
    }
  }

  @Get('/reservations/day')
  async getDailyReservations(
    @Query() query: DailyReservationsQueryDto,
    @Headers('Idempotency-Key') idempotencyKey: string,
  ) {
    try {
      const cachedResponse =
        this.reqCollector.executeIdempotent(idempotencyKey);
      if (cachedResponse) return cachedResponse;

      const response =
        await this.reservationsService.getDailyReservations(query);

      this.reqCollector.endRequest(idempotencyKey, response);
      return response;
    } catch (e) {
      this.reqCollector.endRequest(idempotencyKey, null);
      throw e;
    }
  }
}
