import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

// ConfigService - доблена из-за требования тестов
@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, ConfigService],
  exports: [UserService],
})
export class UserModule {}
