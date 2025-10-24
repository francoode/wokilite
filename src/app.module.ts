import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReservationsModule } from './reservations/reservations.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersModule } from './customers/customers.module';
import { RestaurantModule } from './restaurant/restaurant.module';

@Module({
  imports: [ReservationsModule, TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'db',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'wokilite',
    }), CustomersModule, RestaurantModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
