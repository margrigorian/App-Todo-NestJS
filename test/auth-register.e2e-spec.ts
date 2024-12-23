import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/modules/app/app.module';
import { UserResponse } from 'src/modules/auth/response';
import { CreateUserDTO } from 'src/modules/user/dto';

// ТЕСТ ОКАЗЫВАЕТ ВОЗДЕЙСТВИЕ И МЕНЯЕТ ЗАПИСИ В РЕАЛЬНОЙ БАЗЕ ДАННЫХ

describe('ToDo-App (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe('Creating new users (POST)', () => {
    const CREATE_USER_URL = '/auth/register';

    it('should create a new user', () => {
      const dto: CreateUserDTO = { email: 'k@gmail.com', password: '34567' };
      // id создоваемого юзера при тестировании нужно обновлять
      // происходит реальное воздействие на БД, и такой пользователь уже может существовать,
      // что приведет к ошибке
      const response: UserResponse = { id: 28, email: 'k@gmail.com' };

      return request(app.getHttpServer())
        .post(CREATE_USER_URL)
        .send(dto)
        .expect(201)
        .expect(response);
    });

    it('should return a 400 when incorrect email is provided', () => {
      const dto = { email: 'k@gmail', password: '34567' };
      const errorMessage = 'email must be an email';

      return request(app.getHttpServer())
        .post(CREATE_USER_URL)
        .send(dto)
        .expect(400)
        .then((res) => {
          expect(res.body.message[0]).toEqual(errorMessage);
        });
    });

    it('should return a 400 when incorrect password is provided', () => {
      const dto = { email: 'k@gmail.com', password: '345' };
      const errorMessage =
        'password must be longer than or equal to 5 characters';

      return request(app.getHttpServer())
        .post(CREATE_USER_URL)
        .send(dto)
        .expect(400)
        .then((res) => {
          expect(res.body.message[0]).toEqual(errorMessage);
        });
    });

    it('should return a 400 when user with this email already exists', () => {
      const dto: CreateUserDTO = { email: 'm@gmail.com', password: '12345' };
      const errorMessage = 'User with this email already exists';

      return request(app.getHttpServer())
        .post(CREATE_USER_URL)
        .send(dto)
        .expect(400)
        .then((res) => {
          expect(res.body.message).toEqual(errorMessage);
        });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
