import { HttpStatus } from '@nestjs/common';

export class HttpResponse {
  constructor(message: string, code?: HttpStatus) {
    this.message = message;
    if (code) this.statusCode = code;
  }

  public statusCode: HttpStatus = HttpStatus.OK;
  public message: string;
  public statusMessage?: string;
  public data?: any;
}
