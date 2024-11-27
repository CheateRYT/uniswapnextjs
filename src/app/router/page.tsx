"use client";
import { useDataContext } from "@/providers/DataProvider";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

const Router: React.FC = () => {
  const { contract, selectedAccountAddress } = useDataContext();
  const router = useRouter();
  const [gerdaAmount, setGerdaAmount] = useState<string>("");
  const [rtkAmount, setRtkAmount] = useState<string>("");

  useEffect(() => {
    if (Object.keys(contract).length === 0) {
      router.push("/auth");
    }
  }, [contract, router]);

  const handleChangeGerdaToRTK = async () => {
    try {
      alert("Ожидайте, обмен Gerda на RTK начался");

      // Проверяем, подключен ли MetaMask
      if (gerdaAmount) {
        // Создаем объект транзакции
        const transactionParameters = {
          to: contract._address, // Адрес вашего контракта
          from: selectedAccountAddress, // Адрес отправителя
          data: contract.methods
            .changeGerdaToRTK(gerdaAmount, selectedAccountAddress)
            .encodeABI(), // Кодируем данные для вызова метода контракта
          // Вы можете добавить gas, gasPrice и другие параметры, если необходимо
        };

        // Отправляем транзакцию и ждем подтверждения
        const txHash = await window.ethereum.request({
          method: "eth_sendTransaction",
          params: [transactionParameters],
        });

        alert(
          `Вы успешно обменяли ${gerdaAmount} Gerda на RTK. Хеш транзакции: ${txHash}. Ожидайте подтверждения транзакции.`
        );
        setGerdaAmount(""); // Сбросим значение инпута
      }
    } catch (error) {
      console.error(`Ошибка при обмене Gerda на RTK: ${error}`);
      alert("Произошла ошибка при обмене. Пожалуйста, попробуйте еще раз.");
    }
  };

  const handleChangeRTKToGerda = async () => {
    try {
      alert("Ожидайте, обмен RTK на Gerda начался");
      if (rtkAmount) {
        const transactionParameters = {
          to: contract._address, // Адрес вашего контракта
          from: selectedAccountAddress, // Адрес отправителя
          data: contract.methods
            .changeRTKToGerda(rtkAmount, selectedAccountAddress)
            .encodeABI(), // Кодируем данные для вызова метода контракта
          // Вы можете добавить gas, gasPrice и другие параметры, если необходимо
        };

        // Отправляем транзакцию и ждем подтверждения
        const txHash = await window.ethereum.request({
          method: "eth_sendTransaction",
          params: [transactionParameters],
        });

        alert(`Вы успешно обменяли ${rtkAmount} RTK на Gerda. Хеш ${txHash}`);
        setRtkAmount(""); // Сбросим значение инпута
      }
    } catch (error) {
      console.error(`Ошибка при обмене RTK на Gerda: ${error}`);
    }
  };

  return (
    <div className="bg-green-900 h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-green-900 text-4xl mb-6 text-center">Роутер</h1>

        {/* Обмен Gerda на RTK */}
        <div className="mb-4">
          <input
            type="number"
            placeholder="Количество Gerda для обмена на RTK"
            value={gerdaAmount}
            onChange={(e) => setGerdaAmount(e.target.value)}
            className="border rounded w-full p-2 mb-4"
          />
          <button
            onClick={handleChangeGerdaToRTK}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold mb-5 py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Обменять Gerda на RTK
          </button>
        </div>

        {/* Обмен RTK на Gerda */}
        <div className="mb-4">
          <input
            type="number"
            placeholder="Количество RTK для обмена на Gerda"
            value={rtkAmount}
            onChange={(e) => setRtkAmount(e.target.value)}
            className="border rounded w-full p-2 mb-4"
          />
          <button
            onClick={handleChangeRTKToGerda}
            className="bg-red-600 hover:bg-red-500 text-white font-bold mb-5 py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Обменять RTK на Gerda
          </button>
        </div>
      </div>
    </div>
  );
};

export default Router;
