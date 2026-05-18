import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ Prisma connected to Neon PostgreSQL');
    } catch (error: any) {
      console.error('❌ Prisma failed to connect to Neon PostgreSQL:', error.message);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
