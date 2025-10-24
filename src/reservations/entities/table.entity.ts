import { AvailabilityQueryResult } from '../interfaces/reservations.types';
export class Table {
  id: string;
  sectorId: string;
  name: string;
  minSize: number;
  maxSize: number;
  createdAt: string;
  updatedAt: string;

  static findTableWithLeastSpace(
    tables: AvailabilityQueryResult[],
  ): AvailabilityQueryResult | null {
    if (!tables || tables.length === 0) return null;

    return tables.reduce((prev, curr) => {
      const prevAvailable = prev.maxSize - (prev.partySize ?? 0);
      const currAvailable = curr.maxSize - (curr.partySize ?? 0);

      return currAvailable < prevAvailable ? curr : prev;
    });
  }

}
