import { IsString, IsNotEmpty, IsInt, Min, IsISO8601, IsEmail, Matches, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class CustomerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsEmail()
  email: string;
}

export class CreateReservationDto {
  @IsString()
  @IsNotEmpty()
  restaurantId: string;

  @IsString()
  @IsNotEmpty()
  sectorId: string;

  @IsInt()
  @Min(1)
  partySize: number;

  @IsISO8601()
  startDateTimeISO: string;

  @ValidateNested()
  @Type(() => CustomerDto)
  customer: CustomerDto;

  @IsString()
  @IsNotEmpty()
  notes: string;
}
