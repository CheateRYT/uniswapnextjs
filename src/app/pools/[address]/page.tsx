"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDataContext } from "@/providers/DataProvider";

const CurrentPool: React.FC = () => {
  const { contract, selectedAccountAddress } = useDataContext();
  const currentPoolAddress = useParams().address;
  const [poolName, setPoolName] = useState<string>("");
  const [firstTokenReserve, setFirstTokenReserve] = useState<string>("0");
  const [secondTokenReserve, setSecondTokenReserve] = useState<string>("0");
  const [amountToSwapFirst, setAmountToSwapFirst] = useState<string>("");
  const [amountToSwapSecond, setAmountToSwapSecond] = useState<string>("");
  const [amountToAddFirst, setAmountToAddFirst] = useState<string>("");
  const [amountToAddSecond, setAmountToAddSecond] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    if (Object.keys(contract).length === 0) {
      router.push("/auth");
    }
  }, [contract, router]);

  const fetchPoolData = async () => {
    if (contract && currentPoolAddress) {
      try {
        // Получаем имя пула
        const name: string = await contract.methods
          .getPoolName(currentPoolAddress)
          .call();
        setPoolName(name);
        // Получаем резервы токенов
        const firstReserve: number = await contract.methods
          .getFirstTokenReserve(currentPoolAddress)
          .call();
        const secondReserve: number = await contract.methods
          .getSecondTokenReserve(currentPoolAddress)
          .call();
        setFirstTokenReserve(firstReserve.toString().slice(0, -12));
        setSecondTokenReserve(secondReserve.toString().slice(0, -12));
      } catch (error) {
        console.error(`Ошибка получения данных пула: ${error}`);
      }
    }
  };

  useEffect(() => {
    fetchPoolData();
  }, [contract, currentPoolAddress]);

  const handleSwapFirstToSecond = async () => {
    try {
      alert("Ожидайте, обмен начался");
      if (amountToSwapFirst) {
        const transactionParameters = {
          to: contract._address, // Адрес вашего контракта
          from: selectedAccountAddress, // Адрес отправителя
          data: contract.methods
            .tradeFirstToSecond(
              currentPoolAddress,
              amountToSwapFirst,
              selectedAccountAddress
            )
            .encodeABI(), // Кодируем данные для вызова метода контракта
          // Вы можете добавить gas, gasPrice и другие параметры, если необходимо
        };

        // Отправляем транзакцию и ждем подтверждения
        const txHash = await window.ethereum.request({
          method: "eth_sendTransaction",
          params: [transactionParameters],
        });

        alert(
          `Обмен ${amountToSwapFirst} первого токена на второй токен выполнен.`
        );
        await fetchPoolData(); // Обновляем данные пула после обмена
      }
    } catch (error) {
      console.error(`Ошибка обмена первого токена на второй: ${error}`);
    }
  };

  const handleSwapSecondToFirst = async () => {
    try {
      alert("Ожидайте, обмен начался");
      if (amountToSwapSecond) {
        const transactionParameters = {
          to: contract._address, // Адрес вашего контракта
          from: selectedAccountAddress, // Адрес отправителя
          data: contract.methods
            .tradeSecondToFirst(
              currentPoolAddress,
              amountToSwapSecond,
              selectedAccountAddress
            )
            .encodeABI(), // Кодируем данные для вызова метода контракта
          // Вы можете добавить gas, gasPrice и другие параметры, если необходимо
        };

        // Отправляем транзакцию и ждем подтверждения
        const txHash = await window.ethereum.request({
          method: "eth_sendTransaction",
          params: [transactionParameters],
        });

        alert(
          `Обмен ${amountToSwapSecond} второго токена на первый токен выполнен.`
        );
        await fetchPoolData(); // Обновляем данные пула после обмена
      }
    } catch (error) {
      console.error(`Ошибка обмена второго токена на первый: ${error}`);
    }
  };

  const handleAddFirstTokenLiquidity = async () => {
    try {
      alert("Ожидайте, добавление ликвидности началось");
      if (amountToAddFirst) {
        const transactionParameters = {
          to: contract._address, // Адрес вашего контракта
          from: selectedAccountAddress, // Адрес отправителя
          data: contract.methods
            .addFirstTokenLiquidity(
              currentPoolAddress,
              amountToAddFirst,
              selectedAccountAddress
            )
            .encodeABI(), // Кодируем данные для вызова метода контракта
          // Вы можете добавить gas, gasPrice и другие параметры, если необходимо
        };

        // Отправляем транзакцию и ждем подтверждения
        const txHash = await window.ethereum.request({
          method: "eth_sendTransaction",
          params: [transactionParameters],
        });

        alert(`Добавлено ${amountToAddFirst} ликвидности в первый токен.`);
        await fetchPoolData(); // Обновляем данные пула после добавления ликвидности
      }
    } catch (error) {
      console.error(`Ошибка добавления ликвидности в первый токен: ${error}`);
    }
  };

  const handleAddSecondTokenLiquidity = async () => {
    try {
      alert("Ожидайте, добавление ликвидности началось");
      if (amountToAddSecond) {
        const transactionParameters = {
          to: contract._address, // Адрес вашего контракта
          from: selectedAccountAddress, // Адрес отправителя
          data: contract.methods
            .addSecondTokenLiquidity(
              currentPoolAddress,
              amountToAddSecond,
              selectedAccountAddress
            )
            .encodeABI(), // Кодируем данные для вызова метода контракта
          // Вы можете добавить gas, gasPrice и другие параметры, если необходимо
        };

        // Отправляем транзакцию и ждем подтверждения
        const txHash = await window.ethereum.request({
          method: "eth_sendTransaction",
          params: [transactionParameters],
        });

        alert(`Добавлено ${amountToAddSecond} ликвидности во второй токен.`);
        await fetchPoolData(); // Обновляем данные пула после добавления ликвидности
      }
    } catch (error) {
      console.error(`Ошибка добавления ликвидности во второй токен: ${error}`);
    }
  };

  return (
    <div className="bg-green-900 h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-green-900 text-4xl mb-6 text-center">{poolName}</h1>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-700">
            Резерв первого токена:
          </h2>
          <p className="text-xl text-green-900">{firstTokenReserve} токенов</p>
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-700">
            Резерв второго токена:
          </h2>
          <p className="text-xl text-green-900">{secondTokenReserve} токенов</p>
        </div>
        {/* Обмен первого токена на второй */}
        <div className="mb-4">
          <input
            type="number"
            placeholder="Количество для обмена первого токена"
            value={amountToSwapFirst}
            onChange={(e) => setAmountToSwapFirst(e.target.value)}
            className="border rounded w-full p-2 mb-4"
          />
          <button
            onClick={handleSwapFirstToSecond}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Обменять первый токен на второй
          </button>
        </div>
        {/* Обмен второго токена на первый */}
        <div className="mb-4">
          <input
            type="number"
            placeholder="Количество для обмена второго токена"
            value={amountToSwapSecond}
            onChange={(e) => setAmountToSwapSecond(e.target.value)}
            className="border rounded w-full p-2 mb-4"
          />
          <button
            onClick={handleSwapSecondToFirst}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Обменять второй токен на первый
          </button>
        </div>
        {/* Добавление ликвидности в первый токен */}
        <div className="mb-4">
          <input
            type="number"
            placeholder="Количество для добавления ликвидности в первый токен"
            value={amountToAddFirst}
            onChange={(e) => setAmountToAddFirst(e.target.value)}
            className="border rounded w-full p-2 mb-4"
          />
          <button
            onClick={handleAddFirstTokenLiquidity}
            className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Добавить ликвидность в первый токен
          </button>
        </div>
        {/* Добавление ликвидности во второй токен */}
        <div className="mb-4">
          <input
            type="number"
            placeholder="Количество для добавления ликвидности во второй токен"
            value={amountToAddSecond}
            onChange={(e) => setAmountToAddSecond(e.target.value)}
            className="border rounded w-full p-2 mb-4"
          />
          <button
            onClick={handleAddSecondTokenLiquidity}
            className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Добавить ликвидность во второй токен
          </button>
        </div>
      </div>
    </div>
  );
};

export default CurrentPool;
