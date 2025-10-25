import { convertDateStringToTzDate } from 'src/shared/shared.helper';
import { Restaurant, Shift } from '../../restaurants/entities/restaurant.entity';
import { Slot } from '../entities/slot';
import {
  AvailabilityQueryResult,
  ReservationsByTable,
  SlotAvailability,
} from '../interfaces/reservations.types';
import { addMinutes } from 'date-fns';
import { RESERVATION_DURATION } from 'src/shared/shared.const';

export class ReservationsHelper {
  static groupReservationsByTable = (
    reservations: AvailabilityQueryResult[],
  ): ReservationsByTable => {
    const tables: ReservationsByTable = {};

    for (const res of reservations) {
      if (!tables[res.tableId]) tables[res.tableId] = [];
      if (res.startDateTimeISO && res.endDateTimeISO && res.status) {
        tables[res.tableId].push({
          startDateTimeISO: res.startDateTimeISO,
          endDateTimeISO: res.endDateTimeISO,
          status: res.status
        });
      }
    }

    return tables;
  };
  

  buildSlotAvailability = (
    reservationTables: ReservationsByTable,
    restaurant: Restaurant,
    date: string,
  ) => {
    const slotStatus: SlotAvailability[] = [];
    const slots = Slot.getSlots(restaurant.shifts || [], date);

    for (const slot of slots) {
      let actualSlot: SlotAvailability = {
        start: slot,
        available: true,
        tables: [],
        reason: '',
      };

      actualSlot.tables = this.getReservedTablesForSlot(reservationTables, slot);

      if (actualSlot.tables.length === 0) {
        actualSlot.available = false;
        actualSlot.reason = 'No tables available';
      }
      slotStatus.push(actualSlot);
      actualSlot = { start: slot, available: true, tables: [], reason: '' };
    }

    return slotStatus;
  };

  private getReservedTablesForSlot = (
    reservationTables: ReservationsByTable,
    slot: string,
  ): string[] => {
    const availableTables: string[] = [];

    for (const tableId in reservationTables) {
      const tReservations = reservationTables[tableId];

      const isReserved = tReservations.find((reservation) => {
        const { startDateTimeISO, endDateTimeISO } = reservation;
        return (
          new Date(slot).getTime() >= new Date(startDateTimeISO).getTime() &&
          new Date(slot).getTime() < new Date(endDateTimeISO).getTime() &&
          reservation.status === 'CONFIRMED'
        );
      });

      if (!isReserved) availableTables.push(tableId);
    }

    return availableTables;
  };

  static getReservationStartAndEnd = (startDateTimeISO: string, timezone: string) => {
          const reservationStart = convertDateStringToTzDate(
            startDateTimeISO,
            timezone,
          );
    
          const reservationEnd = addMinutes(reservationStart, RESERVATION_DURATION);

          return { reservationStart, reservationEnd };
  }

  static isWithinShift = (shifts: Shift[] | undefined, resDate: Date): boolean => {
    if (!shifts || shifts.length === 0) return true;

    const targetHours = resDate.getHours();
    const targetMinutes = resDate.getMinutes();
    const targetTimeInMinutes = targetHours * 60 + targetMinutes;

    const timeToMinutes = (timeStr: string): number => {
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + m;
    };

    return shifts.some((shift) => {
      const startInMinutes = timeToMinutes(shift.start);
      const endInMinutes = timeToMinutes(shift.end);
      return (
        targetTimeInMinutes >= startInMinutes &&
        targetTimeInMinutes <= endInMinutes
      );
    });
  };
}
