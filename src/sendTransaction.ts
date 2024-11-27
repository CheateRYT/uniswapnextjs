// Измените сигнатуру функции sendTransaction
export const sendTransaction = async (
  contract: any,
  selectedAccountAddress: string,
  method: (...args: any[]) => { encodeABI: () => string },
  ...args: any[]
) => {
  try {
    // Создаем параметры транзакции
    const transactionParameters = {
      to: contract._address, // Адрес вашего контракта
      from: selectedAccountAddress, // Адрес отправителя
      data: method(...args).encodeABI(), // Кодируем данные для вызова метода контракта
    };

    // Отправляем транзакцию и ждем подтверждения
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });

    // Ожидаем подтверждения транзакции
    let receipt = null;
    while (receipt === null) {
      receipt = await window.ethereum.request({
        method: "eth_getTransactionReceipt",
        params: [txHash],
      });
      // Задержка перед повторной проверкой
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    return txHash; // Возвращаем хеш транзакции
  } catch (error) {
    console.error(`Ошибка при отправке транзакции: ${error}`);
    throw error; // Пробрасываем ошибку дальше
  }
};
