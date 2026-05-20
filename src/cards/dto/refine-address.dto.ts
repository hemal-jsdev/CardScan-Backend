import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefineAddressDto {
  @ApiProperty({ description: 'Raw scanned address text to parse and clean up', example: 'Sector 62, Noida, UP, 201301' })
  @IsString()
  @IsNotEmpty({ message: 'Address text cannot be empty.' })
  address: string;
}
