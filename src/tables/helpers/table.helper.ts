import { SlotAvailability } from 'src/reservations/interfaces/reservations.types';

export class TableHelper {
  static getAvailableTables = (
    slots: SlotAvailability[],
    reservationStart: Date,
    reservationEnd: Date,
  ): string[] => {
    //Obtengo el estado de los slots dentro del rango de la reserva
    const rangeStatus = slots.filter((slot) => {
      const slotStart = new Date(slot.start);
      return reservationStart <= slotStart && slotStart < reservationEnd;
    });

    //Obtengo las mesas que estan se encuentra libre en alguno de los slots
    const tablesInRange = new Set<string>();
    rangeStatus?.forEach((slot) => {
      slot.tables.forEach((table) => {
        tablesInRange.add(table);
      });
    });

    //Filtro las mesas que no estan libres en todos los slots
    rangeStatus?.forEach((slot) => {
      tablesInRange.forEach((tableId) => {
        if (!slot.tables.includes(tableId)) {
          tablesInRange.delete(tableId);
        }
      });
    });

    return Array.from(tablesInRange);
  };
}
