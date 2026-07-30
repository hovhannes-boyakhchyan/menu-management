import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { FieldError } from '../errors/validation-error';

interface HttpLikeResponse {
  headersSent: boolean;
  status(code: number): this;
  json(body: unknown): this;
  statusCode?: number;
}

const STATUS_KEY: Record<number, string> = {
  [HttpStatus.BAD_REQUEST]: 'request.bad',
  [HttpStatus.UNAUTHORIZED]: 'auth.unauthorized',
  [HttpStatus.FORBIDDEN]: 'auth.forbidden',
  [HttpStatus.NOT_FOUND]: 'resource.not_found',
  [HttpStatus.CONFLICT]: 'resource.conflict',
  [HttpStatus.UNPROCESSABLE_ENTITY]: 'request.unprocessable',
  [HttpStatus.TOO_MANY_REQUESTS]: 'request.too_many',
};

function isFieldErrorArray(value: unknown): value is FieldError[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        item !== null &&
        typeof item === 'object' &&
        'field' in item &&
        'message' in item,
    )
  );
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    if (host.getType() !== 'http') return;

    const ctx = host.switchToHttp();
    const res = ctx.getResponse<HttpLikeResponse>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Internal server error';
    let key: string | null = null;
    let errors: FieldError[] = [];

    if (exception instanceof HttpException) {
      const resp = exception.getResponse();
      if (typeof resp === 'string') {
        message = resp;
      } else if (resp && typeof resp === 'object') {
        const payload = resp as Record<string, unknown>;
        const msg = payload.message;
        if (Array.isArray(msg)) message = msg.join('; ');
        else if (typeof msg === 'string') message = msg;
        else {
          const err = payload.error;
          if (typeof err === 'string' && err) message = err;
          else message = exception.message ?? message;
        }
        if (typeof payload.key === 'string') key = payload.key;
        if (isFieldErrorArray(payload.errors)) errors = payload.errors;
      } else {
        message = exception.message ?? message;
      }
    } else if (exception instanceof Error) {
      console.error('Unhandled error:', exception.message);
      console.error('Stack:', exception.stack);
    }

    if (res.headersSent) return;

    const resolvedKey = key ?? STATUS_KEY[status] ?? 'error.unexpected';

    res.status(status).json({
      data: null,
      meta: {
        status: false,
        key: resolvedKey,
        message,
        statusCode: status,
        errors,
      },
    });
  }
}
