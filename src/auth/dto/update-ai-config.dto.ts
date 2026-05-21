import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAiConfigDto {
  @ApiProperty({ example: 'AIzaSy...', description: 'User-provided Gemini API key', required: false })
  @IsString()
  @IsOptional()
  geminiApiKey?: string;

  @ApiProperty({ example: 'gemini-2.5-flash', description: 'User-provided Gemini Model name', required: false })
  @IsString()
  @IsOptional()
  geminiModel?: string;
}
