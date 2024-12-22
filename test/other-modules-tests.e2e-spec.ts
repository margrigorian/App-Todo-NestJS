import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/modules/app/app.module';
import * as jwt from 'jsonwebtoken';
import { UserResponse } from 'src/modules/auth/response';
import { TodoResponse } from 'src/modules/todos/response';
import { CreateTodoDTO, UpdateTodoDTO } from 'src/modules/todos/dto';

describe('ToDo-App (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  function generateAuthToken(user: UserResponse): string {
    const secret = process.env.JWT_SECRET;
    return jwt.sign({ user }, secret);
  }

  it('/users (DELETE)', () => {
    // id удаляемого юзера при тестировании нужно обновлять
    // так как происходит реальное воздействие на БД, и такой пользователь может быть уже удален
    const user = { id: 28, email: 'k@gmail.com' };
    // имитируем генерацию токена
    const token = generateAuthToken(user);

    return request(app.getHttpServer())
      .delete('/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect({});
  });

  it('/todos (POST)', () => {
    const user = { id: 18, email: 'a@gmail.com' };
    const token = generateAuthToken(user);
    const dto: CreateTodoDTO = { title: 'House cleaning' };
    const response: TodoResponse = {
      id: 7,
      title: 'House cleaning',
      completed: false,
      userId: 18,
    };

    return request(app.getHttpServer())
      .post('/todos')
      .send(dto)
      .set('Authorization', `Bearer ${token}`)
      .expect(201)
      .expect(response);
    // нужно обновлять значение возвращаемого todoId (expect({id: ...})),
    // так как запись с таким id может уже существовать
  });

  it('/todos (GET)', () => {
    const user = { id: 1, email: 'm@gmail.com' };
    const token = generateAuthToken(user);
    const response: TodoResponse[] = [
      {
        id: 1,
        title: 'Report',
        completed: true,
        userId: 1,
      },
    ];

    return request(app.getHttpServer())
      .get('/todos')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(response);
  });

  it('/todos (PATCH)', () => {
    const user = { id: 18, email: 'a@gmail.com' };
    const token = generateAuthToken(user);
    const todoId = 3;
    // свойства опциональные, но тест запрашивает оба
    const dto: UpdateTodoDTO = { title: 'Examination', completed: false };
    const response: TodoResponse = {
      id: 3,
      title: 'Examination',
      completed: true,
      userId: 18,
    };

    return request(app.getHttpServer())
      .patch(`/todos/${todoId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(dto)
      .expect(200)
      .expect(response);
  });

  it('/todos (DELETE)', () => {
    const user = { id: 18, email: 'a@gmail.com' };
    const token = generateAuthToken(user);
    // id удаляемого todo при тестировании нужно обновлять
    // так как происходит реальное воздействие на БД, и такая запить может быть уже удалена
    const todoId = 7;

    return request(app.getHttpServer())
      .delete(`/todos/${todoId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect({});
  });

  afterAll(async () => {
    await app.close();
  });
});
