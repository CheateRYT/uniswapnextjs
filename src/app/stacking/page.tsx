"use client";
import { useDataContext } from "@/providers/DataProvider";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

const Stacking: React.FC = () => {
  const { contract, selectedAccountAddress } = useDataContext();
  const router = useRouter();
  const [amountToStake, setAmountToStake] = useState<string>("");
  const [stackedProfi, setStackedProfi] = useState<string>("0");
  useEffect(() => {
    if (!contract) {
      router.push("/auth");
    }
    fetchStackedProfi();
  }, [contract, router]);
  const fetchStackedProfi = async () => {
    try {
      const data: number = await contract.methods
        .getMyStackingBalance(selectedAccountAddress)
        .call();
      setStackedProfi(data.toString());
    } catch (error) {
      console.error(`Ошибка получения баланса profi на стейкинге: ${error}`);
    }
  };

  const handleStakeTokens = async () => {
    try {
      alert("Ожидайте, стейкинг начался");
      if (amountToStake) {
        const transactionParameters = {
          to: contract._address, // Адрес вашего контракта
          from: selectedAccountAddress, // Адрес отправителя
          data: contract.methods
            .putLPProfi(amountToStake, selectedAccountAddress)
            .encodeABI(), // Кодируем данные для вызова метода контракта
          // Вы можете добавить gas, gasPrice и другие параметры, если необходимо
        };

        // Отправляем транзакцию и ждем подтверждения
        const txHash = await window.ethereum.request({
          method: "eth_sendTransaction",
          params: [transactionParameters],
        });

        alert(`Вы успешно положили ${amountToStake} LP токенов на стейкинг.`);
        setAmountToStake(""); // Сбросим значение инпута
        fetchStackedProfi();
      }
    } catch (error) {
      console.error(`Ошибка при стейкинге токенов: ${error}`);
    }
  };

  const handleWithdrawAllTokens = async () => {
    try {
      alert("Ожидайте, снятие токенов началось");
      const transactionParameters = {
        to: contract._address, // Адрес вашего контракта
        from: selectedAccountAddress, // Адрес отправителя
        data: contract.methods
          .returnMyStack(selectedAccountAddress)
          .encodeABI(), // Кодируем данные для вызова метода контракта
        // Вы можете добавить gas, gasPrice и другие параметры, если необходимо
      };

      // Отправляем транзакцию и ждем подтверждения
      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [transactionParameters],
      });

      fetchStackedProfi();
      alert(`Вы успешно сняли все LP токены со стейкинга.`);
    } catch (error) {
      console.error(`Ошибка при снятии токенов: ${error}`);
    }
  };

  const handleClaimRewards = async () => {
    try {
      alert("Ожидайте, получение награды началось");
      const transactionParameters = {
        to: contract._address, // Адрес вашего контракта
        from: selectedAccountAddress, // Адрес отправителя
        data: contract.methods.takeReward(selectedAccountAddress).encodeABI(), // Кодируем данные для вызова метода контракта
        // Вы можете добавить gas, gasPrice и другие параметры, если необходимо
      };

      // Отправляем транзакцию и ждем подтверждения
      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [transactionParameters],
      });

      fetchStackedProfi();
      alert(`Вы успешно забрали свои награды.`);
    } catch (error) {
      console.error(`Ошибка при получении награды: ${error}`);
    }
  };

  return (
    <div className="bg-green-900 h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-green-900 text-4xl mb-6 text-center">Стейкинг</h1>

        {/* Положить LP токены на стейкинг */}
        <div className="mb-4">
          <input
            type="number"
            placeholder="Количество LP токенов для стейкинга"
            value={amountToStake}
            onChange={(e) => setAmountToStake(e.target.value)}
            className="border rounded w-full p-2 mb-4"
          />
          <button
            onClick={handleStakeTokens}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold mb-5 py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Положить LP токены на стейкинг
          </button>
        </div>

        {/* Снять все LP токены со стейкинга */}
        <div className="mb-4">
          <button
            onClick={handleWithdrawAllTokens}
            className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Снять все LP токены со стейкинга
          </button>
        </div>

        {/* Забрать награду */}
        <div className="mb-4">
          <button
            onClick={handleClaimRewards}
            className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Забрать награду
          </button>
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Стейкинг:</h2>
          <p className="text-green-900 font-bold">
            Баланс ProfiCoin на стейкинге: {stackedProfi || 0} токенов
          </p>
        </div>
      </div>
    </div>
  );
};

export default Stacking;
