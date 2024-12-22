import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { UserResponse } from '../auth/response';

@Injectable()
export class TokenService {
  constructor(private readonly configService: ConfigService) {}

  async generateJwtToken(user: UserResponse): Promise<string> {
    try {
      const payload = { user };
      const secret = this.configService.get<string>('jwt_secret');

      return jwt.sign(payload, secret, {
        expiresIn: '1h',
      });
    } catch (err) {
      throw new Error(err);
    }
  }
}
