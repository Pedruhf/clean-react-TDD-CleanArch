import React from "react";
import { fireEvent, render, RenderResult } from "@testing-library/react";
import Input from "./index";
import Context from "@/presentation/contexts/form/form-context";
import { faker } from "@faker-js/faker";

const makeSut = (fieldName: string): RenderResult => {
  return render(
    <Context.Provider value={{ state: {} }}>
      <Input name={fieldName} />
    </Context.Provider>
  );
};

describe("Input Component", () => {
  test("Should begin with readOnly", () => {
    const field = faker.database.column();
    const sut = makeSut(field);
    const input = sut.getByTestId(field) as HTMLInputElement;
    expect(input.readOnly).toBe(true);
  });

  test("Should disable readOnly on focus", () => {
    const field = faker.database.column();
    const sut = makeSut(field);
    const input = sut.getByTestId(field) as HTMLInputElement;
    fireEvent.focus(input)
    expect(input.readOnly).toBe(false);
  });

  test("Should focus input on label click", () => {
    const field = faker.database.column();
    const sut = makeSut(field);
    const input = sut.getByTestId(field) as HTMLInputElement;
    const label = sut.getByTestId(`${field}-label`) as HTMLLabelElement;
    fireEvent.click(label);
    expect(document.activeElement).toBe(input);
  });
});
