import { AccountModel } from "@/domain/models";
import { createContext } from "react";

type ApiContextProps = {
  setCurrentAccount?: (account: AccountModel) => void;
  getCurrentAccount?: () => AccountModel;
};

export default createContext<ApiContextProps>(null);