import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/modules/app/app.module';
import { TodoResponse } from 'src/modules/todos/response';
import { CreateTodoDTO, UpdateTodoDTO } from 'src/modules/todos/dto';
import { TokenService } from '../src/modules/token/token.service';

// ТЕСТ ОКАЗЫВАЕТ ВОЗДЕЙСТВИЕ И МЕНЯЕТ ЗАПИСИ В РЕАЛЬНОЙ БАЗЕ ДАННЫХ

describe('ToDo-App (e2e)', () => {
  let app: INestApplication;
  let tokenService: TokenService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    // так TokenService будет доступен в тесте, и работа его станет асинхронной
    tokenService = moduleFixture.get<TokenService>(TokenService);
  });

  it('/users (DELETE)', async () => {
    // id удаляемого юзера при тестировании нужно обновлять
    // так как происходит реальное воздействие на БД, и такой пользователь может быть уже удален
    const user = { id: 28, email: 'k@gmail.com' };
    // имитируем генерацию токена
    const token = await tokenService.generateJwtToken(user);

    return request(app.getHttpServer())
      .delete('/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect({});
  });

  it('/todos (POST)', async () => {
    const user = { id: 18, email: 'a@gmail.com' };
    const token = await tokenService.generateJwtToken(user);
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

  it('/todos (GET)', async () => {
    const user = { id: 1, email: 'm@gmail.com' };
    const token = await tokenService.generateJwtToken(user);
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

  it('/todos (PATCH)', async () => {
    const user = { id: 18, email: 'a@gmail.com' };
    const token = await tokenService.generateJwtToken(user);
    const todoId = 3;
    // свойства опциональные, но тест запрашивает оба
    const dto: UpdateTodoDTO = { title: 'Examination', completed: true };
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

  it('/todos (DELETE)', async () => {
    const user = { id: 18, email: 'a@gmail.com' };
    const token = await tokenService.generateJwtToken(user);
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
