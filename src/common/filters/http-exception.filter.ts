/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';

export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const message =
      typeof exceptionResponse === 'object'
        ? exceptionResponse.message || exception.message
        : exception.message;

    response.status(status).json({
      success: false,
      statusCode: status,
      timeStamp: new Date().toISOString(),
      message: message,
    });
  }
}
