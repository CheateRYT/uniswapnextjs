"use client";

import React, { createContext, useContext, useState } from "react";
import { Contract, ContractAbi } from "web3";

interface DataProviderType {
  contract: Contract<ContractAbi>; // Уточните тип, если возможно
  contractId: string;
  selectedAccountAddress: string;
  setContract: (contract: Contract<ContractAbi>) => void;
  setContractId: (contractId: string) => void;
  userNames: string[];
  setUserNames: (userNames: string[]) => void;
  setSelectedAccountAddress: (selectedAccountAddress: string) => void;
}

const DataContext = createContext<DataProviderType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [contract, setContract] = useState<Contract<ContractAbi>>({});
  const [userNames, setUserNames] = useState<string[]>([]);
  const [contractId, setContractId] = useState<string>("");
  const [selectedAccountAddress, setSelectedAccountAddress] =
    useState<string>("");

  return (
    <DataContext.Provider
      value={{
        contract,
        userNames,
        setUserNames,
        setContract,
        contractId,
        setContractId,
        selectedAccountAddress,
        setSelectedAccountAddress,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("Context not found");
  }
  return context;
};
