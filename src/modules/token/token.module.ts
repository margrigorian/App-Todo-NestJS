import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { ConfigService } from '@nestjs/config';

// ConfigService - доблена из-за требования тестов
@Module({
  providers: [TokenService, ConfigService],
  exports: [TokenService],
})
export class TokenModule {}
