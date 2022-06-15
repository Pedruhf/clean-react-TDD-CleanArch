import { FieldValidation } from "@/validation/protocols";
import { ValidationComposite } from "./validation-composite";

class FieldValidationSpy implements FieldValidation {
  public error: Error = null;
  constructor (readonly field: string) {}

  validate (value: string): Error {
    return this.error;
  }
}

describe('Validation Composite', () => {
  test('Should return error if any validation fails', () => {
    const fieldValidationSpy = new FieldValidationSpy("any_field");
    const fieldValidationSpy2 = new FieldValidationSpy("any_field");
    fieldValidationSpy2.error = new Error("any_error_message");

    const sut = new ValidationComposite([
      fieldValidationSpy,
      fieldValidationSpy2
    ]);
    const error = sut.validate("any_field", "any_value");
    expect(error).toBe("any_error_message");
  });
});
