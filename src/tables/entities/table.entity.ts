import { NotFoundException } from '@nestjs/common';

export class Table {
  id: string;
  sectorId: string;
  name: string;
  minSize: number;
  maxSize: number;
  createdAt: string;
  updatedAt: string;

  static findTableWithLeastSpace(tables: Table[], partySize: number): Table {
    const validTables = tables.filter(
      (table) => partySize >= table.minSize && partySize <= table.maxSize,
    );

    if (validTables.length === 0)
      throw new NotFoundException('No suitable table found');


    // Ordeno por capacidad máxima en forma ascendente
    validTables.sort((a, b) => a.maxSize - b.maxSize);

    // Retornar la más pequeña
    return validTables[0];
  }
}
