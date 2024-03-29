import { InvalidFieldError } from "@/validation/errors";
import { EmailValidation } from "./email-validation";
import { faker } from "@faker-js/faker";

const makeSut = (field: string = faker.database.column()): EmailValidation => {
  return new EmailValidation(field);
}

describe('Email Validation', () => {
  test('Should return error if email is invalid', () => {
    const field = faker.database.column();
    const sut = makeSut(field);
    const error = sut.validate({ [field]: faker.database.column() });
    expect(error).toEqual(new InvalidFieldError(field));
  });

  test('Should return falsy if email is valid', () => {
    const field = faker.database.column();
    const sut = makeSut();
    const error = sut.validate({ [field]: faker.internet.email() });
    expect(error).toBeFalsy();
  });

  test('Should return falsy if email is empty', () => {
    const field = faker.database.column();
    const sut = makeSut();
    const error = sut.validate({ [field]: faker.internet.email() });
    expect(error).toBeFalsy();
  });
});
