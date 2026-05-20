import { IsString, IsNotEmpty, IsOptional, IsEmail, IsBoolean, IsNumber, Min, Max, IsObject, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCardDto {
  @ApiProperty({ description: 'Full name extracted or entered', example: 'Aryan Dev Sharma' })
  @IsString()
  @IsNotEmpty({ message: 'Full Name is a mandatory field and cannot be blank.' })
  @MaxLength(150)
  fullName: string;


  @ApiProperty({ description: 'Job title', required: false, example: 'Lead System Architect' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  jobTitle?: string;

  @ApiProperty({ description: 'Department name', required: false, example: 'Engineering Operations' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  department?: string;

  @ApiProperty({ description: 'Company name', required: false, example: 'Hindustan Tech Labs' })
  @IsString()
  @IsOptional()
  @MaxLength(150)
  company?: string;

  @ApiProperty({ description: 'Company website URL', required: false, example: 'https://hindustantech.in' })
  @IsString()
  @IsOptional()
  companyWebsite?: string;

  @ApiProperty({ description: 'Email address', required: false, example: 'aryan.sharma@hindustantech.in' })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({ description: 'Work phone number', required: false, example: '+911204445555' })
  @IsString()
  @IsOptional()
  @MaxLength(30)
  phoneWork?: string;

  @ApiProperty({ description: 'Mobile phone number', required: false, example: '+919876543210' })
  @IsString()
  @IsOptional()
  @MaxLength(30)
  phoneMobile?: string;

  @ApiProperty({ description: 'Other phone number', required: false, example: '' })
  @IsString()
  @IsOptional()
  @MaxLength(30)
  phoneOther?: string;

  @ApiProperty({ description: 'Full physical address', required: false, example: '402, Pinnacle Towers, Sector 62' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ description: 'City', required: false, example: 'Noida' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  city?: string;

  @ApiProperty({ description: 'State', required: false, example: 'Uttar Pradesh' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  state?: string;

  @ApiProperty({ description: 'Country', required: false, example: 'India' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  country?: string;

  @ApiProperty({ description: 'Postal code', required: false, example: '201301' })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  postalCode?: string;

  @ApiProperty({ description: 'LinkedIn profile link', required: false, example: 'https://linkedin.com/in/aryansharmalabs' })
  @IsString()
  @IsOptional()
  linkedIn?: string;

  @ApiProperty({ description: 'Twitter profile link', required: false, example: '' })
  @IsString()
  @IsOptional()
  twitter?: string;

  @ApiProperty({ description: 'Dynamic key-value attributes stored as a JSON object', required: false, example: { "Alternate Email": "aryan.personal@gmail.com" } })
  @IsObject()
  @IsOptional()
  customFields?: Record<string, any>;

  @ApiProperty({ description: 'Indian GSTIN number', required: false, example: '09AAAAA1111A1Z1' })
  @IsString()
  @IsOptional()
  @MaxLength(15)
  gstin?: string;

  @ApiProperty({ description: 'True if card represents a Private QR Scanned user', default: false, example: false })
  @IsBoolean()
  @IsOptional()
  isBadge?: boolean;

  @ApiProperty({ description: 'Full raw text output from OCR scanner', required: false, example: 'Aryan Dev Sharma\nLead System Architect\nHindustan Tech Labs' })
  @IsString()
  @IsOptional()
  rawExtractedText?: string;

  @ApiProperty({ description: 'Cloud storage URL of the front image', required: false, example: '' })
  @IsString()
  @IsOptional()
  frontImageUrl?: string;

  @ApiProperty({ description: 'Cloud storage URL of the back image', required: false, example: '' })
  @IsString()
  @IsOptional()
  backImageUrl?: string;

  @ApiProperty({ description: 'OCR text recognition confidence rate (0.0 to 1.0)', default: 1.0, example: 0.96 })
  @IsNumber()
  @Min(0.0)
  @Max(1.0)
  @IsOptional()
  confidence?: number;
}
