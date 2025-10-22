import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Restaurant } from './restaurant.entity';
import { Table } from './table.entity';
import { Reservation } from './reservation.entity';

@Entity('sectors')
export class Sector {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string; // e.g., "Main Hall", "Terrace"

  @ManyToOne(() => Restaurant, (restaurant) => restaurant.sectors, { onDelete: 'CASCADE' })
  restaurant: Restaurant;

  @OneToMany(() => Table, (table) => table.sector)
  tables: Table[];

  @OneToMany(() => Reservation, (r) => r.sector)
  reservations: Reservation[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
