import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { CreateReservationDto } from '../../reservations/dtos/create-reservation.dto';
import { DataSource } from 'typeorm';

@Injectable()
export class CustomersRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  create = async (name: string, phone: string, email: string) => {
    const query = `
      INSERT INTO customers (name, phone, email)
      VALUES (?, ?, ?)
    `;
    const result = await this.dataSource.query(query, [name, phone, email]);
    return result.insertId;
  };

  getByEmail = async (email: string) => {
    const query = `
      SELECT id, name, phone, email, createdAt, updatedAt
      FROM customers
      WHERE email = ?
      LIMIT 1
    `;
    const result = await this.dataSource.query(query, [email]);
    return result[0] || null;
  };

  getOrCreate = async (data: CreateReservationDto) => {
    let customer = await this.getByEmail(data.customer.email);
    if (!customer) {
      const customerId = await this.create(
        data.customer.name,
        data.customer.phone,
        data.customer.email,
      );
      customer = await this.getByEmail(data.customer.email);
    }
    return customer;
  };
}
