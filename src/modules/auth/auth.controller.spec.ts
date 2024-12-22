import { Test } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        // Прямая передача сервисов, например, AuthService, без provide приводит к непосредственному воздействию на БД
        // Соответственно, это может потребовать прямого включения и других сервисов в качестве зависимостей, (например, TokenSrevice)

        // { provide: AuthService } предоставляет мок-объект вместо реального экземпляра AuthService,
        // что ограждает БД от прямого воздествия и не требует подключения этих самых зависимостей

        {
          provide: AuthService,
          useValue: {
            register: jest.fn().mockResolvedValue({
              id: 19,
              email: 'k@gmail.com',
            }),
            login: jest.fn().mockResolvedValue({
              user: {
                id: 19,
                email: 'k@gmail.com',
              },
              token: 'expected_token',
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should create a new user', async () => {
    const mockUser = {
      email: 'k@gmail.com',
      password: '34567',
    };
    expect(await controller.register(mockUser)).toEqual({
      id: 19,
      email: 'k@gmail.com',
    });
  });

  it('should auth user', async () => {
    const mockUser = {
      email: 'k@gmail.com',
      password: '34567',
    };
    expect(await controller.login(mockUser)).toEqual({
      user: {
        id: 19,
        email: 'k@gmail.com',
      },
      // конкретно проверить token не удастся, только его наличие со типом string,
      // так как он генерируется случайным образом
      token: expect.any(String),
    });
  });
});
