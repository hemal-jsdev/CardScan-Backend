import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiYXJ5YW5AZXhhbXBsZS5jb20iLCJ0eXBlIjoicmVmcmVzaCIsImlhdCI6MTc4MDIwMDAwMCwiZXhwIjoxODAzOTYwMDAwfQ...' })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
