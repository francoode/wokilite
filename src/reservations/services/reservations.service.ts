import {
  ConflictException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  AvailabilityParam,
  CreateReservationResponse,
  SectorStatusResponse
} from '../interfaces/reservations.types';
import { ReservationsRepository } from '../repositories/reservations.repository';
import { CustomersRepository } from 'src/customers/repositories/customers.repository';
import { CreateReservationDto } from '../dtos/create-reservation.dto';
import { format } from 'date-fns';
import { RESERVATION_DURATION, SLOT_MINUTES } from 'src/shared/shared.const';
import { RestaurantRepository } from 'src/restaurants/repositories/restaurant.repository';
import { ReservationsHelper } from '../helpers/reservation.helper';
import { TableHelper } from 'src/tables/helpers/table.helper';
import { TableRepository } from 'src/tables/table.repository';
import { Table } from 'src/tables/entities/table.entity';
import { DailyReservationsQueryDto } from '../dtos/daily-reservation.dto';

@Injectable()
export class ReservationsService {
  readonly logger: Logger = new Logger(ReservationsService.name);

  @Inject() reservationsRepository: ReservationsRepository;
  @Inject() customersRepository: CustomersRepository;
  @Inject() restaurantRepository: RestaurantRepository;
  @Inject() tableRepository: TableRepository;

  getSectorStatus = async (
    params: AvailabilityParam,
  ): Promise<SectorStatusResponse> => {
    try {
      const restaurant = await this.restaurantRepository.getByIdOrFail(
        params.restaurantId,
      );

      const reservations =
        await this.reservationsRepository.getSectorStatusByPartySize(params);

      const reservationsByTable =
        ReservationsHelper.groupReservationsByTable(reservations);

      const slotsStatus = new ReservationsHelper().buildSlotAvailability(
        reservationsByTable,
        restaurant,
        params.date,
      );

      return {
        slotMinutes: SLOT_MINUTES,
        durationMinutes: RESERVATION_DURATION,
        slots: slotsStatus,
      };
    } catch (e) {
      if (e instanceof HttpException) throw e;
      throw new InternalServerErrorException('Failed to get sector status');
    }
  };

  create = async (
    data: CreateReservationDto,
  ): Promise<CreateReservationResponse> => {
    try {
      const { restaurantId, partySize } = data;

      const customer = await this.customersRepository.getOrCreate(data);

      const restaurant =
        await this.restaurantRepository.getByIdOrFail(restaurantId);

      const { reservationStart, reservationEnd } =
        ReservationsHelper.getReservationStartAndEnd(
          data.startDateTimeISO,
          restaurant.timezone,
        );

      //Comprobar que la reserva esté dentro de un turno
      if (
        !ReservationsHelper.isWithinShift(restaurant.shifts, reservationStart)
      ) {
        throw new UnprocessableEntityException(
          'Reservation time is outside of restaurant shifts',
        );
      }

      const sectorStatus = await this.getSectorStatus({
        ...data,
        date: reservationStart.toISOString().substring(0, 10),
      });

      const tablesAvailableIds = TableHelper.getAvailableTables(
        sectorStatus.slots,
        reservationStart,
        reservationEnd,
      );

      if (tablesAvailableIds.length === 0)
        throw new ConflictException(
          'No available table fits party size at requested time',
        );

      const tables =
        await this.tableRepository.findManyById(tablesAvailableIds);
      const table = Table.findTableWithLeastSpace(tables, partySize);

      const reservation = await this.reservationsRepository.create({
        restaurantId,
        sectorId: data.sectorId,
        partySize,
        tableId: table.id,
        startDateTimeISO: format(reservationStart, 'yyyy-MM-dd HH:mm:ss'),
        endDateTimeISO: format(reservationEnd, 'yyyy-MM-dd HH:mm:ss'),
        customerId: customer.id,
        notes: data.notes || ''
      });

      return {
        restaurantId: reservation.restaurantId,
        sectorId: reservation.sectorId,
        partySize: reservation.partySize,
        startDateTimeISO: reservation.startDateTimeISO,
        customer: {
          name: customer.name,
          phone: customer.phone,
          email: customer.email,
        },
        notes: data.notes,
      };
    } catch (e) {
      if (e instanceof HttpException) throw e;
      this.logger.error('Failed to create reservation', e);
      throw new InternalServerErrorException('Failed to create reservation');
    }
  };

  cancel = async (id: string) => {
    try {
      await this.reservationsRepository.cancel(id);
    } catch (e) {
      if (e instanceof HttpException) throw e;
      this.logger.error('Failed to cancel reservation', e);
      throw new InternalServerErrorException('Failed to cancel reservation');
    }
  };

  getDailyReservations = async (params: DailyReservationsQueryDto) => {
    try {
      const reservations =
        await this.reservationsRepository.findDailyReservations(
          params.restaurantId,
          params.date,
          params.sectorId,
        );
      return reservations;
    } catch (e) {
      if (e instanceof HttpException) throw e;
      this.logger.error('Failed to get daily reservations', e);
      throw new InternalServerErrorException(
        'Failed to get daily reservations',
      );
    }
  };
}
