import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty({ example: 'Aryan Dev Sharma', description: 'Full name of the user' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  fullName: string;

  @ApiProperty({ example: 'aryan@example.com', description: 'Valid email address' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'StrongP@ss1', description: 'Password (minimum 8 characters)' })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(72, { message: 'Password must not exceed 72 characters' })
  password: string;
}
