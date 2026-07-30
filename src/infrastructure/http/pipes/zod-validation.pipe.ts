import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import type { ZodType } from 'zod';
import { COMMON_ERRORS } from '@bringit/contracts';
import type {
  FieldError,
  ValidationErrorResponse,
} from '../errors/validation-error';

export interface ZodValidationOptions<T extends ZodType> {
  schema: T;
  passthrough?: boolean;
  parseJson?: boolean;
}

@Injectable()
export class ZodValidationPipe<T extends ZodType> implements PipeTransform {
  constructor(private readonly opts: ZodValidationOptions<T>) {}

  transform(value: unknown) {
    if (typeof value === 'string' && this.opts.parseJson !== false) {
      try {
        value = JSON.parse(value);
      } catch {
        throw new BadRequestException(COMMON_ERRORS.VALIDATION_INVALID_JSON);
      }
    }

    const parsed = this.opts.schema.safeParse(value);

    if (!parsed.success) {
      const errors: FieldError[] = parsed.error.issues.map((issue) => {
        const path = issue.path.map((segment) =>
          typeof segment === 'symbol' ? segment.toString() : segment,
        );
        return {
          path,
          field: path.join('.'),
          message: issue.message,
          code: issue.code,
        };
      });

      const response: ValidationErrorResponse = {
        key: COMMON_ERRORS.VALIDATION_FAILED.key,
        message: COMMON_ERRORS.VALIDATION_FAILED.message,
        errors,
      };
      throw new BadRequestException(response);
    }

    return parsed.data;
  }
}
