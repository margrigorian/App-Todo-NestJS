import { Test } from '@nestjs/testing';
import { TodosService } from './todos.service';
import { PrismaService } from '../prisma/prisma.service';

describe('TodosService', () => {
  let service: TodosService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TodosService,
        {
          provide: PrismaService,
          useValue: {
            todo: {
              // обращение к методу призмы
              create: jest.fn().mockResolvedValue({
                id: 4,
                title: 'Another',
                completed: false,
                userId: 18,
              }),
              findMany: jest.fn().mockResolvedValue([
                {
                  id: 4,
                  title: 'Another',
                  completed: false,
                  userId: 18,
                },
              ]),
              update: jest.fn().mockResolvedValue({
                id: 4,
                title: 'Another',
                completed: true,
                userId: 18,
              }),
              delete: jest.fn().mockResolvedValue(true),
            },
          },
        },
      ],
    }).compile();

    service = module.get<TodosService>(TodosService);
  });

  it('should create a todo', async () => {
    const mockUserId = 18;
    const mockTitle = 'Another';
    expect(await service.createTodo(mockUserId, mockTitle)).toEqual({
      id: 4,
      title: 'Another',
      completed: false,
      userId: 18,
    });
  });

  it('should return todos list', async () => {
    const mockUserId = 18;
    expect(await service.getListTodos(mockUserId)).toEqual([
      {
        id: 4,
        title: 'Another',
        completed: false,
        userId: 18,
      },
    ]);
  });

  it('should update todo', async () => {
    const mockParam = 4;
    const mockDTO = {
      title: 'Another',
      completed: true,
    };
    const mockUserId = 18;
    expect(await service.updateTodo(mockParam, mockDTO, mockUserId)).toEqual({
      id: 4,
      title: 'Another',
      completed: true,
      userId: 18,
    });
  });

  it('should delete todo', async () => {
    const mockParam = 4;
    const mockUserId = 18;
    expect(await service.deleteTodo(mockParam, mockUserId)).toEqual(true);
  });
});
