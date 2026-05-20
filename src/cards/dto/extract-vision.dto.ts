import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ExtractVisionDto {
  @ApiProperty({ description: 'Base64 encoded string of the front card image', example: 'data:image/jpeg;base64,...' })
  @IsString()
  @IsNotEmpty({ message: 'imageBase64 cannot be empty.' })
  imageBase64: string;
}
