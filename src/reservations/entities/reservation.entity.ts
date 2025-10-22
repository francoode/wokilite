import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { Restaurant } from './restaurant.entity';
import { Sector } from './sector.entity';
import { Table } from './table.entity';
import { Customer } from './customer.entity';

export type ReservationStatus = 'CONFIRMED' | 'PENDING' | 'CANCELLED';

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Restaurant, (r) => r.reservations, { onDelete: 'CASCADE' })
  restaurant: Restaurant;

  @ManyToOne(() => Sector, (s) => s.reservations, { onDelete: 'CASCADE' })
  sector: Sector;


  @ManyToMany(() => Table)
  @JoinTable()
  tables: Table[];

  @ManyToOne(() => Customer, (c) => c.reservations, { cascade: true })
  customer: Customer;

  @Column()
  partySize: number;

  @Column()
  startDateTimeISO: string;

  @Column()
  endDateTimeISO: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'text', default: 'CONFIRMED' })
  status: ReservationStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
