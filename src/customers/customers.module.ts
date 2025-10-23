import { Module } from '@nestjs/common';
import { CustomersRepository } from './repositories/customers.repository';

@Module({
  providers: [CustomersRepository]
})
export class CustomersModule {}
