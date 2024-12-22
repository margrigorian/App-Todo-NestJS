import { Test } from '@nestjs/testing';
import { TokenService } from './token.service';

describe('TokenService', () => {
  let service: TokenService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: TokenService,
          useValue: {
            generateJwtToken: jest.fn().mockResolvedValue('expected_token'),
          },
        },
      ],
    }).compile();

    service = module.get<TokenService>(TokenService);
  });

  it('should jwt token', async () => {
    const mockUser = { id: 18, email: 'a@gmail.com' };
    expect(await service.generateJwtToken(mockUser)).toEqual(
      expect.any(String),
    );
  });
});
