import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Table } from './entities/table.entity';

@Injectable()
export class TableRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async findManyById(ids: string[]): Promise<Table[]> {
    const placeholders = ids.map(() => '?').join(',');
    const result = await this.dataSource.query(
      `
          SELECT *
          FROM tables
          WHERE id IN (${placeholders});
      `,
      [...ids]
    );
    return result;
  }
}