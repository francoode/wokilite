import { IsString, IsISO8601, IsOptional } from 'class-validator';

export class DailyReservationsQueryDto {
  @IsString()
  restaurantId: string;

  @IsISO8601()
  date: string;

  @IsString()
  @IsOptional()
  sectorId?: string;
}