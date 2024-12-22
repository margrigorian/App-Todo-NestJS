import { Test } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn().mockResolvedValue({
                id: 19,
                email: 'k@gmail.com',
                password: '34567',
              }),
              // функция использутся дважды, нужно разграничивать
              findUnique: jest.fn((args) => {
                // args - передаваемые параметры, where - встроенное свойство,
                // email - параметр поиска в соответствии с используемым на самом деле в findUnique функции
                if (args.where.email === 'k@gmail.com') {
                  return {
                    id: 19,
                    email: 'k@gmail.com',
                    password: '34567',
                  };
                } else if (args.where.id === 19) {
                  return {
                    id: 19,
                    email: 'k@gmail.com',
                  };
                }
              }),
              delete: jest.fn().mockResolvedValue(true),
            },
          },
        },
        {
          // Не дублируем UserService, он уже выше подключен, это приводит к ошибкам теста PrismaService
          // задаем иное произвольное имя - 'HashPasswordService'
          provide: 'HashPasswordService',
          useValue: {
            hashPassword: jest
              .fn()
              .mockResolvedValue('expected_hashed_password'),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should create a new user', async () => {
    const mockUser = {
      email: 'k@gmail.com',
      password: '34567',
    };
    expect(await service.createUser(mockUser)).toEqual({
      id: 19,
      email: 'k@gmail.com',
      password: '34567',
    });
  });

  it('should create hashed password', async () => {
    const mockPassword = '12345';
    // конкретно проверить hashed password не удастся, только его наличие со типом string,
    // так как он генерируется случайным образом
    expect(await service.hashPassword(mockPassword)).toEqual(
      expect.any(String),
    );
  });

  it('should return user info', async () => {
    const mockEmail = 'k@gmail.com';
    expect(await service.findUserByEmail(mockEmail)).toEqual({
      id: 19,
      email: 'k@gmail.com',
      password: '34567',
    });
  });

  it('should return user info without password', async () => {
    const mockUserId = 19;
    expect(await service.publicUser(mockUserId)).toEqual({
      id: 19,
      email: 'k@gmail.com',
    });
  });

  it('should delete user', async () => {
    const mockUserId = 19;
    expect(await service.deleteUser(mockUserId)).toEqual(true);
  });
});
