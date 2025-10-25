import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationsRepository } from './reservations/repositories/reservations.repository';
import { ReservationsService } from './reservations/services/reservations.service';
import { RestaurantRepository } from './restaurants/repositories/restaurant.repository';
import { CustomersRepository } from './customers/repositories/customers.repository';
import { ReservationsController } from './reservations/reservations.controller';
import { TableRepository } from './tables/table.repository';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'db',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'wokilite',
    }),
  ],
  controllers: [
    ReservationsController
  ],
  providers: [
    ReservationsRepository,
    ReservationsService,
    RestaurantRepository,
    CustomersRepository,
    TableRepository
  ],
})
export class AppModule {}
