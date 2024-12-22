import { Test } from '@nestjs/testing';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';

describe('TodosController', () => {
  let controller: TodosController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [TodosController],
      providers: [
        {
          provide: TodosService,
          useValue: {
            // функция, обращающаяся к TodosService
            createTodo: jest.fn().mockResolvedValue({
              id: 4,
              title: 'Another',
              completed: false,
              userId: 18,
            }),
            getListTodos: jest.fn().mockResolvedValue([
              {
                id: 4,
                title: 'Another',
                completed: false,
                userId: 18,
              },
            ]),
            updateTodo: jest.fn().mockResolvedValue({
              id: 4,
              title: 'Another',
              completed: true,
              userId: 18,
            }),
            deleteTodo: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    controller = module.get<TodosController>(TodosController);
  });

  it('should create a todo', async () => {
    const mockRequest = { user: { id: 18 } };
    const mockDTO = { title: 'Another' };
    expect(await controller.create(mockDTO, mockRequest)).toEqual({
      id: 4,
      title: 'Another',
      completed: false,
      userId: 18,
    });
  });

  it('should return todos list', async () => {
    const mockRequest = { user: { id: 18 } };
    expect(await controller.getList(mockRequest)).toEqual([
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
    // В UpdateTodoDTO свойства title, completed опциональные
    // Тест же требует включения обоих
    const mockDTO = {
      title: 'Another',
      completed: true,
    };
    const mockRequest = { user: { id: 18 } };
    expect(
      await controller.updateTodo(mockParam, mockDTO, mockRequest),
    ).toEqual({
      id: 4,
      title: 'Another',
      completed: true,
      userId: 18,
    });
  });

  it('should delete todo', async () => {
    const mockParam = 4;
    const mockRequest = { user: { id: 18 } };
    expect(await controller.deleteTodo(mockParam, mockRequest)).toEqual(true);
  });
});
