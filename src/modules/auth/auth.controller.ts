import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from '../user/dto';
import { UserLoginDTO } from './dto';
import { UserAuthResponse, UserResponse } from './response';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiTags('API')
  @ApiResponse({ status: 201, type: UserResponse })
  @Post('register')
  register(@Body() dto: CreateUserDTO): Promise<UserResponse> {
    return this.authService.register(dto);
  }

  @ApiTags('API')
  @ApiResponse({ status: 200, type: UserAuthResponse })
  @HttpCode(200)
  @Post('login')
  login(@Body() dto: UserLoginDTO): Promise<UserAuthResponse> {
    return this.authService.login(dto);
  }
}
