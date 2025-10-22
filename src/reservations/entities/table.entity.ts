import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Sector } from './sector.entity';
import { Reservation } from './reservation.entity';

@Entity('tables')
export class Table {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string; // e.g., "T1", "A5"

  @Column()
  minSize: number;

  @Column()
  maxSize: number;

  @ManyToOne(() => Sector, (sector) => sector.tables, { onDelete: 'CASCADE' })
  sector: Sector;

  @OneToMany(() => Reservation, (r) => r.table)
  reservations: Reservation[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
