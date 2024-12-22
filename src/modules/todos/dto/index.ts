import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateTodoDTO {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  title: string;
}

// чтобы повторно не создавать DTO для действия update
// export type UpdateTodoDTO = Partial<CreateTodoDTO>;
// так Partial определяет поля title, completed, если он включен, как необязательные, что позволяет проводить частичное обновление
// но при этом входящие данные не проходят проверку по типам свойств DTO - title: string
// Partial, например, пропускает title: number, что приводит к ошибкам и падению сервера

// Поэтому лучше прямая типизация
export class UpdateTodoDTO {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @MinLength(1)
  title: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  completed: boolean;
}
