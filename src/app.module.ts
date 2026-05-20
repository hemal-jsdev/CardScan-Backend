import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { CardsModule } from './cards/cards.module';
import { NotesModule } from './notes/notes.module';

@Module({
  imports: [
    // Load .env globally across all modules
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    CardsModule,
    NotesModule,
  ],
})
export class AppModule {}
