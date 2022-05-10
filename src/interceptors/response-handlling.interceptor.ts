import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const getMessageFromMethod =(method:string) => {
    switch(method){
       case 'GET': 
         return 'data retrieved successfully';
       case 'POST': 
         return 'data added successfully';
       case 'PUT': 
         return 'data updated successfully';
       case 'PATCH': 
         return 'data updated successfully';
       case 'DELETE': 
         return 'data deleted successfully';   
    }
}

export interface Response<T> {
  statusCode: number;
  message: string;
  data: Object;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next
      .handle()
      .pipe(
        map((response) => ({
          statusCode: context.switchToHttp().getResponse().statusCode,
          message: response?.message || getMessageFromMethod(context.switchToHttp().getResponse().req.method),
          data: response?.data || {}
        })),
      );
  }
}