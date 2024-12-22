import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(private configService: ConfigService) {
    super({
      datasources: {
        db: {
          // test считывает configService.get<string>('database') как undefined, что приводит к ошибкам
          // но при это в обычном режиме все работает
          // url: configService.get<string>('database')
          url: process.env.DATABASE_URL,
        },
      },
      log: ['info'],
    });
  }
}
