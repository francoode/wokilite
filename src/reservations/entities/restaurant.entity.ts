import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Sector } from './sector.entity';
import { Reservation } from './reservation.entity';

@Entity('restaurants')
export class Restaurant {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  timezone: string; // (e.g., "America/Argentina/Buenos_Aires")

  @Column({ type: 'json', nullable: true })
  shifts?: Array<{ start: string; end: string }>; // e.g., [{ start: "18:00", end: "23:00" }]

  @OneToMany(() => Sector, (sector) => sector.restaurant)
  sectors: Sector[];

  @OneToMany(() => Reservation, (r) => r.restaurant)
  reservations: Reservation[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
