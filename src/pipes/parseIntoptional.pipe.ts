import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class ParseIntOptionalPipe implements PipeTransform {
  transform(value: string): number | undefined {
    if (value === undefined) {
      return undefined;
    }
    return parseInt(value);
  }
}
