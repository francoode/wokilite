import { isBefore, addMinutes, format, parse } from 'date-fns';
import { formatInTimeZone } from "date-fns-tz";

import { Restaurant, Shift } from 'src/reservations/entities/restaurant.entity';

export class Slot {

  static getSlots(shifts: Shift[] = [], timezone: string): string[] {
    const interval = 15;
    const slots: string[] = [];

    const periods = shifts?.length
      ? shifts
      : [{ start: '00:00', end: '23:59' }];

    for (const period of periods) {
      let current = parse(period.start, 'HH:mm', new Date());
      const endTime = parse(period.end, 'HH:mm', new Date());

      while (isBefore(current, endTime)) {
        slots.push(formatInTimeZone(current, timezone ,"yyyy-MM-dd'T'HH:mm:ssXXX"));
        current = addMinutes(current, interval);
      }
    }

    return slots;
  }
}
