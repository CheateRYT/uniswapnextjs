"use client";
import { useDataContext } from "@/providers/DataProvider";
import { sendTransaction } from "@/sendTransaction";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Profile: React.FC = () => {
  const { contract, selectedAccountAddress } = useDataContext();
  const [userName, setUserName] = useState<string>("");
  const [balances, setBalances] = useState<{ [key: string]: string }>({
    GerdaCoin: "0.00",
    KrendelCoin: "0.00",
    RTKCoin: "0.00",
    ProfiCoin: "0.00",
  });

  const router = useRouter();
  const [isStartCoinsDistributed, setIsStartCoinsDistributed] = useState(false);
  // Проверка на аутентификацию
  if (Object.keys(contract).length === 0) {
    router.push("/auth");
    return null; // Возвращаем null, чтобы избежать рендеринга до перенаправления
  }

  const fetchUserName = async () => {
    try {
      const data = await contract.methods
        .returnUserName(selectedAccountAddress)
        .call();
      setUserName(data);
    } catch (error) {
      console.error(`Ошибка получения имени: ${error}`);
    }
  };

  const fetchBalances = async () => {
    try {
      const balanceArray = await contract.methods
        .getBalances(selectedAccountAddress)
        .call();
      setBalances({
        GerdaCoin: balanceArray[0].toString().slice(0, -12) || 0,
        KrendelCoin: balanceArray[1].toString().slice(0, -12) || 0,
        RTKCoin: balanceArray[2].toString().slice(0, -12) || 0,
        ProfiCoin: balanceArray[3].toString().slice(0, -12) || 0,
      });
    } catch (error) {
      console.error(`Ошибка получения балансов: ${error}`);
    }
  };

  const handleDistributeTokens = async () => {
    try {
      alert("Ожидайте, токены раздаются...");
      // const transactionParameters = {
      //   to: contract._address, // Адрес вашего контракта
      //   from: selectedAccountAddress, // Адрес отправителя
      //   data: contract.methods.giveStartTokensToUsers(10000).encodeABI(), // Кодируем данные для вызова метода контракта
      //   // Вы можете добавить gas, gasPrice и другие параметры, если необходимо
      // };

      // // Отправляем транзакцию и ждем подтверждения
      // const txHash = await window.ethereum.request({
      //   method: "eth_sendTransaction",
      //   params: [transactionParameters],
      // });
      // let receipt = null;
      // while (receipt === null) {
      //   receipt = await window.ethereum.request({
      //     method: "eth_getTransactionReceipt",
      //     params: [txHash],
      //   });
      //   // Задержка перед повторной проверкой
      //   await new Promise((resolve) => setTimeout(resolve, 2000));
      // }
      const txHash = await sendTransaction(
        contract,
        selectedAccountAddress,
        contract.methods.giveStartTokensToUsers,
        10000
      );
      fetchBalances();

      alert("Стартовые токены успешно разданы!");
      localStorage.setItem("isStartTokenDistributed", "true");
    } catch (error) {
      console.error(`Ошибка раздачи токенов: ${error}`);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("isStartTokenDistributed")) {
      localStorage.setItem("isStartTokenDistributed", "false");
    }

    fetchUserName();
    fetchBalances();
  }, []);

  return (
    <div className="bg-green-900 h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-green-900 text-4xl mb-6 text-center">
          Личный кабинет
        </h1>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-700">
            Имя пользователя:
          </h2>
          <p className="text-xl text-green-900">{userName}</p>
        </div>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-700">Баланс:</h2>
          <ul className="space-y-2">
            {Object.entries(balances).map(([token, amount]) => (
              <li key={token} className="flex justify-between">
                <span className="text-gray-600">{token}:</span>
                <span className="text-green-900 font-bold">
                  {amount} токенов
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Кнопка для раздачи стартовых токенов */}
        {userName === "Owner" &&
          localStorage.getItem("isStartTokenDistributed") == "false" && (
            <div className="mt-6">
              <button
                onClick={handleDistributeTokens}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              >
                Раздать стартовые токены пользователям
              </button>
            </div>
          )}
      </div>
    </div>
  );
};

export default Profile;
