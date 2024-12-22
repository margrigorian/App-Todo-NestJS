import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDTO } from '../user/dto';
import { UserLoginDTO } from './dto';
import { AppError } from '../../common/constants/errors';
import { TokenService } from '../token/token.service';
import { UserService } from '../user/user.service';
import { UserAuthResponse, UserResponse } from './response';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  async register(dto: CreateUserDTO): Promise<UserResponse> {
    try {
      const isExistingUser = await this.userService.findUserByEmail(dto.email);
      // если пользователь с таким email уже существует, пробрасываем ошибку
      if (isExistingUser) throw new BadRequestException(AppError.USER_EXISTS);
      // в противном случае регистрация будет пройдена
      // возвращаем значение, так как нужно получить id нового юзера
      const newUser = await this.userService.createUser(dto);
      // информация о пользователе без пароля
      // может проще удалить пароль вручную из объекта newUser?
      return this.userService.publicUser(newUser.id);
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err;
      } else {
        throw new Error(err);
      }
    }
  }

  async login(dto: UserLoginDTO): Promise<UserAuthResponse> {
    try {
      const isExistingUser = await this.userService.findUserByEmail(dto.email);
      // если пользователь с таким email не существует или же неверен пароль, пробрасываем ошибку
      if (
        !isExistingUser ||
        !(await bcrypt.compare(dto.password, isExistingUser.password))
      ) {
        throw new BadRequestException(AppError.INVALID_CREDENTIALS);
      }

      const user = await this.userService.publicUser(isExistingUser.id);
      const token = await this.tokenService.generateJwtToken(user);
      return { user, token };
    } catch (err) {
      if (err instanceof BadRequestException) {
        throw err;
      } else {
        throw new Error(err);
      }
    }
  }
}
