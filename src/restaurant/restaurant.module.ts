import { Module } from '@nestjs/common';
import { RestaurantRepository } from './repositories/restaurant.repository';

@Module({
  providers: [RestaurantRepository]
})
export class RestaurantModule {}
