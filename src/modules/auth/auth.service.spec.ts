import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
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

    service = module.get<AuthService>(AuthService);
  });

  it('should create a new user', async () => {
    const mockUser = {
      email: 'k@gmail.com',
      password: '34567',
    };
    expect(await service.register(mockUser)).toEqual({
      id: 19,
      email: 'k@gmail.com',
    });
  });

  it('should auth user', async () => {
    const mockUser = {
      email: 'k@gmail.com',
      password: '34567',
    };
    expect(await service.login(mockUser)).toEqual({
      user: {
        id: 19,
        email: 'k@gmail.com',
      },
      token: expect.any(String),
    });
  });
});
