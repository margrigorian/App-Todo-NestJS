import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { AppError } from '../common/constants/errors';

@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string): number {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException(AppError.VALIDATION_FAILED);
    }

    return val;
  }
}
