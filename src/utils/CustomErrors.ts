export abstract class CustomError extends Error {
    protected constructor(
        public statusCode: number,
        message: string
    ) {
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

export class IllegalArgumentError extends Error {
    constructor(message: string, ...illegalArguments: string[]) {
        let illegalArgsString = "";
        illegalArguments.forEach((value) => {
            illegalArgsString.concat(value);
        });
        super(
            `Message: ${message}.\tIllegal argument(s): ${illegalArgsString}`
        );
        this.name = "IllegalArgumentError";
    }
}
