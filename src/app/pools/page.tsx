"use client";
import { useDataContext } from "@/providers/DataProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Pools: React.FC = () => {
  const { contract, selectedAccountAddress } = useDataContext();
  const [poolAddresses, setPoolAddresses] = useState<string[]>([]);
  const [poolNames, setPoolNames] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [poolName, setPoolName] = useState("");
  const [firstTokenAddress, setFirstTokenAddress] = useState("");
  const [secondTokenAddress, setSecondTokenAddress] = useState("");
  const [firstTokenPrice, setFirstTokenPrice] = useState(0);
  const [secondTokenPrice, setSecondTokenPrice] = useState(0);
  const [lpAddress, setLpAddress] = useState("");
  const [startingEthRatio, setStartingEthRatio] = useState(0);
  const [GerdaAddress, setGerdaAddress] = useState("");
  const [KrendelAddress, setKrendelAddress] = useState("");
  const [RTKAddress, setRTKAddress] = useState("");
  const [ProfiAddress, setProfiAddress] = useState("");
  const router = useRouter();

  // Проверка на аутентификацию
  useEffect(() => {
    if (Object.keys(contract).length === 0) {
      router.push("/auth");
    }
  }, [contract, router]);

  const fetchPools = async () => {
    try {
      const addresses: [] = await contract.methods.getAllPoolsAddress().call();
      setPoolAddresses(addresses);
      const names: [] = await contract.methods.getPoolNames(addresses).call();
      setPoolNames(names);
    } catch (error) {
      console.error(`Ошибка получения пулов: ${error}`);
    }
  };

  useEffect(() => {
    fetchPools();
    fetchCoinAddresses();
  }, []);

  const fetchCoinAddresses = async () => {
    try {
      const gerda: number = await contract.methods.Gerda().call();
      const krendel: number = await contract.methods.Krendel().call();
      const rtk: number = await contract.methods.RTK().call();
      const profi: number = await contract.methods.Profi().call();
      setGerdaAddress(gerda.toString());
      setKrendelAddress(krendel.toString());
      setRTKAddress(rtk.toString());
      setProfiAddress(profi.toString());
    } catch (error) {
      console.error(`Ошибка получения адресов токенов ${error} `);
    }
  };

  const handleCreatePool = async () => {
    try {
      alert("Ожидайте, пул создается");
      await contract.methods
        .createPool(
          poolName,
          firstTokenAddress,
          secondTokenAddress,
          firstTokenPrice,
          secondTokenPrice,
          lpAddress,
          startingEthRatio
        )
        .send({ from: selectedAccountAddress });
      // Закрываем модальное окно после успешного создания пула
      setIsModalOpen(false);

      // Обновляем список пулов
      fetchPools();
    } catch (error) {
      console.error(`Ошибка создания пула: ${error}`);
    }
  };

  return (
    <div className="bg-green-900 h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-green-900 text-4xl mb-6 text-center">Пулы</h1>
        <div className="space-y-4">
          {poolNames.map((name, index) => (
            <Link
              key={poolAddresses[index]}
              href={`/pools/${poolAddresses[index]}`}
            >
              <button className="bg-green-900 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
                {name}
              </button>
            </Link>
          ))}
          {/* Кнопка для открытия модального окна */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Создать пул
          </button>
        </div>
      </div>
      {/* Модальное окно для создания пула */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h2 className="text-green-900 text-2xl mb-4 text-center">
              Создание пула
            </h2>
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold">Адрес GerdaCoin:</h3>
              <p className="text-gray-700 text-sm">{GerdaAddress}</p>
            </div>
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold">Адрес KrendelCoin:</h3>
              <p className="text-gray-700 text-sm">{KrendelAddress}</p>
            </div>
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold">Адрес RTKCoin:</h3>
              <p className="text-gray-700 text-sm">{RTKAddress}</p>
            </div>
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold">Адрес ProfiCoin:</h3>
              <p className="text-gray-700 text-sm">{ProfiAddress}</p>
            </div>
            <input
              type="text"
              placeholder="Имя пула"
              value={poolName}
              onChange={(e) => setPoolName(e.target.value)}
              className="border rounded w-full p-2 mb-4"
            />
            <input
              type="text"
              placeholder="Адрес первого токена"
              value={firstTokenAddress}
              onChange={(e) => setFirstTokenAddress(e.target.value)}
              className="border rounded w-full p-2 mb-4"
            />
            <input
              type="text"
              placeholder="Адрес второго токена"
              value={secondTokenAddress}
              onChange={(e) => setSecondTokenAddress(e.target.value)}
              className="border rounded w-full p-2 mb-4"
            />
            <label htmlFor="">Цена первого токена</label>
            <input
              type="number"
              placeholder="Цена первого токена"
              value={firstTokenPrice}
              onChange={(e) => setFirstTokenPrice(Number(e.target.value))}
              className="border rounded w-full p-2 mb-4"
            />
            <label htmlFor="">Цена второго токена</label>
            <input
              type="number"
              placeholder="Цена второго токена"
              value={secondTokenPrice}
              onChange={(e) => setSecondTokenPrice(Number(e.target.value))}
              className="border rounded w-full p-2 mb-4"
            />
            <input
              type="text"
              placeholder="Адрес LP"
              value={lpAddress}
              onChange={(e) => setLpAddress(e.target.value)}
              className="border rounded w-full p-2 mb-4"
            />
            <label htmlFor="">Начальное соотношение ETH</label>
            <input
              type="number"
              placeholder="Начальное соотношение ETH"
              value={startingEthRatio}
              onChange={(e) => setStartingEthRatio(Number(e.target.value))}
              className="border rounded w-full p-2 mb-4"
            />
            <div className="flex justify-between">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-400 hover:bg-gray-300 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Закрыть
              </button>
              <button
                onClick={handleCreatePool}
                className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Создать
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pools;
