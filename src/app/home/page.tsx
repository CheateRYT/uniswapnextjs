"use client";
import { useDataContext } from "@/providers/DataProvider";
import Link from "next/link"; // Импортируем Link из next/link
import { useRouter } from "next/navigation";

const Home = () => {
  const { contract } = useDataContext();
  const router = useRouter();
  if (Object.keys(contract).length === 0) {
    router.push("/auth");
  } else {
    console.log(contract);
  }

  return (
    <div className="bg-green-900 h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-green-900 text-4xl mb-6 text-center">Главная</h1>
        <div className="space-y-4">
          {" "}
          {/* Используем space-y для вертикальных отступов между кнопками */}
          <Link href="/profile">
            <button className="bg-green-900 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
              Личный кабинет
            </button>
          </Link>
          <Link href="/pools">
            <button className="bg-green-900 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
              Пулы
            </button>
          </Link>
          <Link href="/stacking">
            <button className="bg-green-900 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
              Стейкинг
            </button>
          </Link>
          <Link href="/router">
            <button className="bg-green-900 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
              Роутер
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
