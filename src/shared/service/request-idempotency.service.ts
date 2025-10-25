import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';

export type RequestRegister = {
  [key: string]: {
    inProgress: boolean;
    response: any;
  };
};

@Injectable()
export class RequestCollector {
  private requests: RequestRegister = {};

  executeIdempotent = (requestId: string) => {
    if (!requestId) {
      throw new BadRequestException('Missing Idempotency-Key header');
    }
    const req = this.requests[requestId];
    if (req && req.inProgress)
      throw new ConflictException('Request is already being processed');
    if (req && req.response) return req.response;

    this.requests[requestId] = { inProgress: true, response: null };
    return false;
  };
}
