export class AppError extends Error {
	constructor(
		public readonly statusCode: number,
		message: string,
		public readonly details?: unknown,
	) {
		super(message);
		Object.setPrototypeOf(this, new.target.prototype);
	}
}

export class NotFoundError extends AppError {
	constructor(message: string, details?: unknown) {
		super(404, message, details);
	}
}

export class ValidationError extends AppError {
	constructor(message: string, details?: unknown) {
		super(400, message, details);
	}
}

export class ConflictError extends AppError {
	constructor(message: string, details?: unknown) {
		super(409, message, details);
	}
}
