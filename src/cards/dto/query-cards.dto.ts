import { IsOptional, IsString, IsInt, Min, Max, IsBoolean, IsIn } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryCardsDto {
  @ApiPropertyOptional({ description: 'Pagination page number', default: 1 })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Number of records per page', default: 20, maximum: 100 })
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  @IsOptional()
  limit?: number = 20;

  @ApiPropertyOptional({ description: 'Field to sort cards by', default: 'date', enum: ['date', 'name', 'company', 'confidence'] })
  @IsString()
  @IsIn(['date', 'name', 'company', 'confidence'])
  @IsOptional()
  sortBy?: string = 'date';

  @ApiPropertyOptional({ description: 'Order of sorting', default: 'desc', enum: ['asc', 'desc'] })
  @IsString()
  @IsIn(['asc', 'desc'])
  @IsOptional()
  sortOrder?: string = 'desc';

  @ApiPropertyOptional({ description: 'Fuzzy text query to search across fullName, company, email, and jobTitle' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter only low OCR confidence cards (< 50%)', default: false })
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsOptional()
  lowConfidence?: boolean;

  @ApiPropertyOptional({ description: 'Filter only cards containing a non-empty GSTIN number', default: false })
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsOptional()
  hasGstin?: boolean;

  @ApiPropertyOptional({ description: 'Filter cards missing essential fields (e.g. "email,phone")', example: 'email,phone' })
  @IsString()
  @IsOptional()
  missingContact?: string;

  @ApiPropertyOptional({ description: 'Filter only cards with a LinkedIn or Twitter link', default: false })
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsOptional()
  hasSocial?: boolean;

  @ApiPropertyOptional({ description: 'Filter by Private QR scanned status' })
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsOptional()
  isBadge?: boolean;
}
