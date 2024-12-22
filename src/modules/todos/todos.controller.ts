import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Param,
  Delete,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDTO, UpdateTodoDTO } from './dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../guards/jwt-guard';
import { TodoResponse } from './response';
import { ParseIntPipe } from '../../pipes/parseint.pipe';

@Controller('todos')
export class TodosController {
  constructor(private todosService: TodosService) {}

  @ApiTags('API')
  @ApiResponse({ status: 201, type: TodoResponse })
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateTodoDTO, @Req() request): Promise<TodoResponse> {
    const user = request.user;
    return this.todosService.createTodo(user.id, dto.title);
  }

  @ApiTags('API')
  @ApiResponse({ status: 200, type: TodoResponse })
  // только авторизированный пользователь может видеть список Todo, и только свой список
  @UseGuards(JwtAuthGuard)
  @Get()
  getList(@Req() request): Promise<TodoResponse[]> {
    const user = request.user;
    return this.todosService.getListTodos(user.id);
  }

  @ApiTags('API')
  @ApiResponse({ status: 200, type: TodoResponse })
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateTodo(
    @Param('id', ParseIntPipe) id: number,
    @Body()
    dto: UpdateTodoDTO,
    @Req() request,
  ): Promise<TodoResponse> {
    const user = request.user;
    return this.todosService.updateTodo(id, dto, user.id);
  }

  @ApiTags('API')
  @ApiResponse({ status: 200 })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteTodo(
    @Param('id', ParseIntPipe) id: number,
    @Req() request,
  ): Promise<boolean> {
    const user = request.user;
    return this.todosService.deleteTodo(id, user.id);
  }
}
