import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const base64Data = file.buffer.toString('base64');
        const dataUri = `data:${file.mimetype};base64,${base64Data}`;
        
        cloudinary.uploader.upload(
          dataUri,
          {
            folder: 'cardscan_poc',
            resource_type: 'auto',
          },
          (error, result) => {
            if (error) {
              reject(new InternalServerErrorException(`Cloudinary upload failed: ${error.message}`));
            } else if (result) {
              resolve(result.secure_url);
            } else {
              reject(new InternalServerErrorException('Cloudinary upload returned undefined result.'));
            }
          },
        );
      } catch (err) {
        reject(new InternalServerErrorException(`Base64 encoding failed: ${err.message}`));
      }
    });
  }
}
