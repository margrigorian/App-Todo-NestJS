import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AppError } from '../../common/constants/errors';
import { TodoResponse } from './response';
import { UpdateTodoDTO } from './dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class TodosService {
  constructor(private prisma: PrismaService) {}

  async createTodo(userId: number, title: string): Promise<TodoResponse> {
    try {
      return this.prisma.todo.create({
        data: { title, userId },
      });
    } catch (err) {
      throw new Error(err);
    }
  }

  async getListTodos(userId: number): Promise<TodoResponse[]> {
    try {
      return this.prisma.todo.findMany({ where: { userId } });
    } catch (err) {
      throw new Error(err);
    }
  }

  async updateTodo(
    id: number,
    dto: UpdateTodoDTO,
    userId: number,
  ): Promise<TodoResponse> {
    try {
      const todo = await this.prisma.todo.update({
        where: { id, userId },
        // добавляем id, так как в dto он не присутствует как опциональное свойство
        data: { ...dto, id },
      });

      // напрямую return await this.prisma.todo.update лучше не возвращать
      // в случае неверного id, в соответствии с которым нет todo, сервер будет падать
      // без обработки ошибки в блоке catch

      return todo;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        throw new NotFoundException(AppError.TODO_NOT_FOUND);
      } else {
        throw new Error(err);
      }
    }
  }

  async deleteTodo(todoId: number, userId: number): Promise<boolean> {
    try {
      await this.prisma.todo.delete({ where: { id: todoId, userId } });
      return true;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        throw new NotFoundException(AppError.TODO_NOT_FOUND);
      } else {
        throw new Error(err);
      }
    }
  }
}
