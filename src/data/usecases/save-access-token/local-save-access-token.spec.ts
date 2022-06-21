import { SetStorage } from "@/data/protocols/cache";
import { LocalSaveAccessToken } from "./local-save-access-token";
import { faker } from "@faker-js/faker";

class SetStorageSpy implements SetStorage {
  public key: string;
  public value: string;
  async set (key: string, value: any): Promise<void> {
    this.key = key;
    this.value = value;
  }
}

type SutTypes = {
  sut: LocalSaveAccessToken;
  setStorageSpy: SetStorageSpy;
};

const makeSut = (): SutTypes => {
  const setStorageSpy = new SetStorageSpy();
  const sut = new LocalSaveAccessToken(setStorageSpy);

  return {
    sut,
    setStorageSpy,
  };
};

describe('LocalSaveAccessToken usecase', () => {
  test('Should call SetStorage with correct value', async () => {
    const { sut, setStorageSpy } = makeSut();
    const accessToken = faker.datatype.uuid();
    await sut.save(accessToken);
    expect(setStorageSpy.key).toBe("accessToken");
    expect(setStorageSpy.value).toBe(accessToken);
  });
});
