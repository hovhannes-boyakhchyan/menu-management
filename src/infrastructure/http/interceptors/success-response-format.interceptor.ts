import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface HttpLikeResponse {
  headersSent: boolean;
  status(code: number): this;
  json(body: unknown): this;
  statusCode?: number;
}

@Injectable()
export class ResponseFormatInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'http') return next.handle();

    const httpCtx = context.switchToHttp();
    const res = httpCtx.getResponse<HttpLikeResponse>();

    return next.handle().pipe(
      map((data: unknown) => {
        if (res.headersSent) return data;

        const statusCode =
          typeof res.statusCode === 'number' ? res.statusCode : 200;

        return {
          data,
          meta: {
            status: true,
            statusCode,
          },
        };
      }),
    );
  }
}
