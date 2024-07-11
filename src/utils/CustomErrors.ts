export abstract class CustomError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}

export class BadRequestError extends CustomError {
  constructor(message: string) {
    super(400, message);
  }
}

export class ForbiddenError extends CustomError {
  constructor(message: string) {
    super(403, message);
  }
}
