export class UniqueUserException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UniqueUserException";

    Object.setPrototypeOf(this, UniqueUserException.prototype);
  }
}

export class UserNotFoundExceptionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserNotFoundException";
    Object.setPrototypeOf(this, UserNotFoundExceptionError.prototype);
  }
}

// error for ProductCategoryNotFoundException
export class ProductCategoryNotFoundException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProductCategoryNotFoundException";
    Object.setPrototypeOf(this, ProductCategoryNotFoundException.prototype);
  }
}

export class IncorrectPasswordError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "IncorrectPasswordException";
    Object.setPrototypeOf(this, IncorrectPasswordError.prototype);
  }
}
