import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Restaurant } from './restaurant.entity';
import { Table } from './table.entity';
import { Reservation } from './reservation.entity';
import { ISODateTime } from 'src/shared/types';


@Entity('sectors')
export class Sector {
  id: string;
  restaurantId: string;
  name: string;                                    
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}
