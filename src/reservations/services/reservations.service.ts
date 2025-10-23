import { Inject, Injectable } from '@nestjs/common';
import {
  AvailabilityParam,
  AvailabilityQueryResult,
  AvailabilitySerialize,
  SerializeTime,
} from '../interfaces/reservations.types';
import { ReservationsRepository } from '../repositories/reservations.repository';
import { Slot } from 'src/shared/slot';
import { CustomersRepository } from 'src/customers/repositories/customers.repository';
import { CreateReservationDto } from '../dtos/create-reservation.dto';
import { Table } from '../entities/table.entity';

@Injectable()
export class ReservationsService {
  @Inject() reservationsRepository: ReservationsRepository;
  @Inject() customersRepository: CustomersRepository;

  checkAvailability = async (params: AvailabilityParam) => {
    console.log('params', params);
    const restaurant = await this.reservationsRepository.getRestaurantById(
      params.restaurantId,
    );

    if (!restaurant) throw new Error('Restaurant not found');

    const reservations =
      await this.reservationsRepository.getSectorStatusByPartySize(params);

    const reservationsByTable = this.manageTable(reservations);

    const slots = Slot.getSlots(restaurant.shifts || [], params.date);

    const time = this.serilizeResponse(reservationsByTable, slots);

    return {
      slotMinutes: 15,
      durationMinutes: 90,
      slots: time,
    };
  };

  manageTable = (reservations: AvailabilityQueryResult[]) => {
    const tables: AvailabilitySerialize = {};

    reservations.forEach((r) => {
      if (!tables[r.tableId]) tables[r.tableId] = [];
      if (r.startDateTimeISO && r.endDateTimeISO) {
        tables[r.tableId].push({
          startDateTimeISO: r.startDateTimeISO,
          endDateTimeISO: r.endDateTimeISO,
        });
      }
    });

    return tables;
  };

  serilizeResponse = (rs: AvailabilitySerialize, slots: string[]) => {
    const time: SerializeTime[] = [];

    for (const slot of slots) {
      let actualSlot: SerializeTime = {
        start: slot,
        available: true,
        table: [],
        reason: '',
      };
      for (const r in rs) {
        const reservations = rs[r];

        const isReserved = reservations.find((reservation) => {
          const { startDateTimeISO, endDateTimeISO } = reservation;
          return (
            new Date(slot).getTime() >= new Date(startDateTimeISO).getTime() &&
            new Date(slot).getTime() < new Date(endDateTimeISO).getTime()
          );
        });
        if (!isReserved) actualSlot.table.push(r);
      }
      if (actualSlot.table.length === 0) {
        actualSlot.available = false;
        actualSlot.reason = 'No tables available';
      }
      time.push(actualSlot);
      actualSlot = { start: slot, available: true, table: [], reason: '' };
    }

    return time;
  };

  create = async (data: CreateReservationDto) => {
    const customer = await this.customersRepository.getOrCreate(data);

    const sectorStatus = await this.reservationsRepository.getSectorStatusByPartySize({
      date: data.startDateTimeISO,
      partySize: data.partySize,
      restaurantId: data.restaurantId,
      sectorId: data.sectorId,
    });

    const availableTables = sectorStatus.filter((s) => !s.reservationId);
    const table = Table.findTableWithLeastSpace(availableTables);
    if (!table) throw new Error('No available table found');

    

  };
}
