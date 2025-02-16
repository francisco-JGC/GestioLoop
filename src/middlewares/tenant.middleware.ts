import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

declare module 'express' {
  interface Request {
    tenantId?: string;
  }
}

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const host = req.headers.host || '';
    const parts = host.split('.');

    let tenantId = 'default';

    if (parts.length > 2) {
      tenantId = parts[0]; // e.g. 'tenant1.example.com' => 'tenant1'
    }

    req.tenantId = tenantId; // add tenantId to the request object

    next();
  }
}
