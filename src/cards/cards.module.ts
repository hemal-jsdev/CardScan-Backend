import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { CloudinaryService } from './cloudinary.service';

@Module({
  imports: [PrismaModule, ConfigModule],
  controllers: [CardsController],
  providers: [CardsService, CloudinaryService],
  exports: [CardsService],
})
export class CardsModule {}
