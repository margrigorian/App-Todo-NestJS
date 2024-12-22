import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/modules/app/app.module';
import { UserAuthResponse } from 'src/modules/auth/response';
import { UserLoginDTO } from 'src/modules/auth/dto';

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

  describe('User authorization (POST)', () => {
    const LOGIN_USER_URL = '/auth/login';

    it('should auth user', () => {
      const dto: UserLoginDTO = { email: 'a@gmail.com', password: '23456' };
      const response: UserAuthResponse = {
        user: {
          id: 18,
          email: 'a@gmail.com',
        },
        token: 'expected_token',
      };

      return request(app.getHttpServer())
        .post(LOGIN_USER_URL)
        .send(dto)
        .expect(200)
        .then(() => {
          expect({
            user: {
              id: 18,
              email: 'a@gmail.com',
            },
            token: expect.any(String),
          }).toEqual(response);
        });
    });

    it('should return a 400 when incorrect email is provided', () => {
      const dto = { email: 'a@gmail', password: '23456' };
      const errorMessage = 'email must be an email';

      return request(app.getHttpServer())
        .post(LOGIN_USER_URL)
        .send(dto)
        .expect(400)
        .then((res) => {
          expect(res.body.message[0]).toEqual(errorMessage);
        });
    });

    it('should return a 400 when incorrect password is provided', () => {
      const dto = { email: 'a@gmail.com', password: '234' };
      const errorMessage =
        'password must be longer than or equal to 5 characters';

      return request(app.getHttpServer())
        .post(LOGIN_USER_URL)
        .send(dto)
        .expect(400)
        .then((res) => {
          expect(res.body.message[0]).toEqual(errorMessage);
        });
    });

    it('should return a 400 when invalid email is provided', () => {
      const dto: UserLoginDTO = { email: 'aaa@gmail.com', password: '23456' };
      const errorMessage = 'Invalid credentials';

      return request(app.getHttpServer())
        .post(LOGIN_USER_URL)
        .send(dto)
        .expect(400)
        .then((res) => {
          expect(res.body.message).toEqual(errorMessage);
        });
    });

    it('should return a 400 when invalid password is provided', () => {
      const dto: UserLoginDTO = { email: 'a@gmail.com', password: '23459' };
      const errorMessage = 'Invalid credentials';

      return request(app.getHttpServer())
        .post(LOGIN_USER_URL)
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
