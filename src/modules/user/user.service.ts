import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from './dto';
import { UserResponse } from '../auth/response';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(dto: CreateUserDTO): Promise<User> {
    try {
      dto.password = await this.hashPassword(dto.password);
      return await this.prisma.user.create({
        data: { email: dto.email, password: dto.password },
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  async hashPassword(password: string): Promise<string> {
    try {
      return bcrypt.hash(password, 10);
    } catch (err) {
      throw new Error(err);
    }
  }

  async findUserByEmail(email: string): Promise<User> {
    try {
      return this.prisma.user.findUnique({ where: { email } });
    } catch (err) {
      throw new Error(err);
    }
  }

  async publicUser(id: number): Promise<UserResponse> {
    try {
      return this.prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          password: false,
        },
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  async deleteUser(id: number): Promise<boolean> {
    try {
      await this.prisma.user.delete({ where: { id } });
      return true;
    } catch (err) {
      throw new Error(err);
    }
  }
}
