"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation"; // Импортируем useRouter
import abi from "../../contractData/abi";
import { byteCode } from "@/contractData/bytecode.";
import Web3 from "web3";
import { useDataContext } from "@/providers/DataProvider";

declare global {
  interface Window {
    ethereum: import("ethers").Eip1193Provider;
  }
}

const Auth: React.FC = () => {
  const accountRef = useRef<HTMLSelectElement | null>(null);
  const [isAccountSelected, setIsAccountSelected] = useState<boolean>(true);
  const [accounts, setAccounts] = useState<string[]>([]);
  const [isContractLoaded, setIsContractLoaded] = useState<boolean>(false);
  const {
    setContract,
    setSelectedAccountAddress,
    contract,
    setContractId,
    setUserNames,
    userNames,
  } = useDataContext();
  const router = useRouter(); // Создаем экземпляр router

  const fetchUserAddresses = async () => {
    if (typeof window.ethereum === "undefined") {
      alert("Установите MetaMask");
      return [];
    }
    try {
      const data: string[] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccounts(data);
      // Выбор первого аккаунта по умолчанию, если есть аккаунты
      if (data.length > 0) {
        accountRef.current!.value = data[0];
      }
      return data; // Вернуть адреса
    } catch (error) {
      console.error("Ошибка при получении аккаунтов:", error);
      alert("Ошибка при получении аккаунтов");
      return [];
    }
  };

  const createContract = async () => {
    try {
      localStorage.clear();
      const ownerAddress = "0x63A669bbce83699df20AcB0043D9d3548529111d";
      const web3 = new Web3("http://127.0.0.1:8545");
      const contract = new web3.eth.Contract(abi);
      const deployTransaction = contract.deploy({
        data: byteCode,
      });
      const gasPrice = await web3.eth.getGasPrice();
      const options = {
        from: ownerAddress,
        gas: "9464032",
        gasPrice: gasPrice.toString(),
      };
      const deployedContract = await deployTransaction.send(options);
      console.log(
        "Контракт развернут по адресу:",
        deployedContract.options.address
      );
      const readyWeb3 = new Web3(window.ethereum);
      const readyContract = new web3.eth.Contract(
        abi,
        deployedContract.options.address
      );
      const fetchContractId: string = deployedContract.options.address;
      setContract(readyContract);
      setContractId(fetchContractId);
      setIsContractLoaded(true);
    } catch (error) {
      alert("Произошла ошибка, попробуйте перезапустить geth сервер");
      console.error("Ошибка при развертывании контракта:", error);
    }
  };
  useEffect(() => {
    if (userNames.length == 0 && accounts.length > 0) {
      const handleUserNames = async () => {
        try {
          if (contract) {
            const fetchedUserNames: [] = await contract.methods
              .returnUserNames(
                accounts[0],
                accounts[1],
                accounts[2],
                accounts[3]
              )
              .call();
            setUserNames(fetchedUserNames);
          }
        } catch (error) {
          console.error("Ошибка при получении имен пользователей:", error);
        }
      };
      handleUserNames();
    }
  }, [contract]);
  useEffect(() => {
    if (Object.keys(contract).length === 0) {
      createContract();
    }
    if (accounts.length == 0) {
      fetchUserAddresses();
    }
  }, []);
  const handleLogin = () => {
    if (accountRef.current && accountRef.current.value) {
      setIsAccountSelected(true); // Если аккаунт выбран, обновляем состояние
      setSelectedAccountAddress(accountRef.current.value);
      router.push("/home");
    } else {
      setIsAccountSelected(false); // Если аккаунт не выбран, обновляем состояние
    }
  };

  return (
    <div className="bg-green-900 h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-green-900 text-4xl mb-6 text-center">
          Авторизация
        </h1>
        <div className="mb-4">
          <label
            htmlFor="account"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Выберите адрес аккаунта
          </label>
          <select
            ref={accountRef}
            id="account"
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
              isAccountSelected ? "border-gray-300" : "border-red-500"
            }`} // Изменяем цвет обводки в зависимости от состояния
          >
            <option value="">Выбрать...</option>
            {accounts.map((account, index) => (
              <option key={account} value={account}>
                {userNames[index] || "Неизвестный пользователь"}
                {/* Используем объект userNames для отображения имени */}
              </option>
            ))}
          </select>
          {!isContractLoaded && Object.keys(contract).length === 0 && (
            <p className="text-red-500 text-lg mt-1">
              Ожидайте пока контракт запустится
            </p>
          )}
          {!isAccountSelected && (
            <p className="text-red-500 text-sm mt-1">
              Пожалуйста, выберите аккаунт.
            </p>
          )}
        </div>
        <button
          onClick={handleLogin} // Добавляем обработчик клика
          className="bg-green-900 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        >
          Войти
        </button>
      </div>
    </div>
  );
};

export default Auth;
