import { Inject, Injectable } from '@nestjs/common';
import {
  AvailabilityParam,
  ReservationsByTable,
  SlotAvailability,
} from '../interfaces/reservations.types';
import { ReservationsRepository } from '../repositories/reservations.repository';
import { Slot } from 'src/reservations/entities/slot';
import { CustomersRepository } from 'src/customers/repositories/customers.repository';
import { CreateReservationDto } from '../dtos/create-reservation.dto';
import { Table } from '../entities/table.entity';
import { Restaurant, Shift } from '../entities/restaurant.entity';
import { addMinutes, isWithinInterval, parse } from 'date-fns';
import { RESERVATION_DURATION, SLOT_MINUTES } from 'src/shared/shared.const';
import { RestaurantRepository } from 'src/restaurant/repositories/restaurant.repository';
import { ReservationsHelper } from '../helpers/reservation.helper';

@Injectable()
export class ReservationsService {
  @Inject() reservationsRepository: ReservationsRepository;
  @Inject() customersRepository: CustomersRepository;
  @Inject() restaurantRepository: RestaurantRepository;

  getSectorStatus = async (params: AvailabilityParam) => {
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
    } catch (e) {}
  };

  create = async (data: CreateReservationDto) => {
    try {
      const customer = await this.customersRepository.getOrCreate(data);

      const sectorStatus =
        await this.reservationsRepository.getSectorStatusByPartySize({
          ...data,
          date: data.startDateTimeISO,
        });

      const restaurant = await this.restaurantRepository.getByIdOrFail(
        data.restaurantId,
      );

      const availableTables = sectorStatus.filter((s) => !s.reservationId);

      if (!this.isWithinShift(restaurant.shifts, data.startDateTimeISO)) {
        throw new Error('Reservation time is outside of restaurant shifts');
      }

      const table = Table.findTableWithLeastSpace(availableTables);
      if (!table) throw new Error('No available table found');

      const endDate = addMinutes(
        new Date(data.startDateTimeISO),
        RESERVATION_DURATION,
      ).toISOString();

      return this.reservationsRepository.create(data, customer, endDate);
    } catch (e) {
      throw e;
    }
  };

  cancel = async (id: string) => {
    return this.reservationsRepository.cancel(id);
  };

  isWithinShift = (shifts: Shift[] | undefined, time: string): boolean => {
    if (!shifts) return true;
    // parsea la hora que querés verificar
    const target = parse(time, 'HH:mm', new Date());

    return shifts.some((shift) => {
      const start = parse(shift.start, 'HH:mm', new Date());
      const end = parse(shift.end, 'HH:mm', new Date());
      return isWithinInterval(target, { start, end });
    });
  };
}
