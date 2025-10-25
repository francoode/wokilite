import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class RestaurantRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  getByIdOrFail = async (restaurantId: string): Promise<Restaurant> => {
    const result = await this.dataSource.query(
      `
          SELECT *
          FROM restaurants
          WHERE id = ?;
        `,
      [restaurantId],
    );
    const restaurant = result[0] || null;

    if (!restaurant) throw new NotFoundException('Restaurant not found');

    return restaurant;
  };
}
