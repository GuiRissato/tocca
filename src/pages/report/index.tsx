import React, { useState } from "react";
import HeaderLayout from "@/components/HeaderLayout";
import "../../app/globals.css";
import SelectYearButton from "@/components/SelectYearButton";

export default function ReportPage() {

  const [selectedYear, setSelectedYear] = useState<number>(2024);

  return (
    <HeaderLayout>
      {/*
        min-h-screen = faz o container ocupar pelo menos a altura total da tela
        flex flex-col = organiza em coluna
        bg-[#F8F5EE] = fundo claro (exemplo), pode trocar se quiser
      */}
      <div className="container mx-auto pt-[60px] mt-10 mb-10">

        {/* Barra superior (botões OKR e seletor de ano) */}
        <div className="flex items-center justify-between px-8 py-6">
          {/* Botões OKR */}
          <div className="flex space-x-4">
            <button className="bg-[#D8D8D8] rounded-full px-4 py-2 hover:bg-gray-300 transition">
              OKR 1º Trimestre
            </button>
            <button className="bg-[#D8D8D8] rounded-full px-4 py-2 hover:bg-gray-300 transition">
              OKR 2º Trimestre
            </button>
            <button className="bg-[#D8D8D8] rounded-full px-4 py-2 hover:bg-gray-300 transition">
              OKR 3º Trimestre
            </button>
            <button className="bg-[#D8D8D8] rounded-full px-4 py-2 hover:bg-gray-300 transition">
              OKR 4º Trimestre
            </button>
          </div>

          {/* Seletor de ano (select dropdown) */}
          <SelectYearButton years={[2023,2024]} setSelectedYear={setSelectedYear} selectedYear={selectedYear} />
        </div>

        {/*
          Área principal:
          flex-1 = ocupa todo o espaço vertical restante
          justify-center e items-center = centralizam os cards no meio
        */}
        <div className="flex flex-1 justify-center items-center gap-8 h-[calc(100vh-300px)] ">
          <button className="bg-[#D8D8D8] text-center px-6 py-4 rounded-xl w-[430px] hover:bg-gray-400 transition h-[70px]">
            <h2 className="font-semibold text-lg mb-2">Progresso do OKR</h2>
          </button>

          <button className="bg-[#D8D8D8] text-center px-6 py-4 rounded-xl w-[430px] hover:bg-gray-400 transition h-[70px]">
            <h2 className="font-semibold text-lg mb-2">Desempenho das Tarefas</h2>
          </button>

          <button className="bg-[#D8D8D8] text-center px-6 py-4 rounded-xl w-[430px] hover:bg-gray-400 transition h-[70px]">
            <h2 className="font-semibold text-lg mb-2">Prazos e Datas Importantes</h2>
          </button>
        </div>
      </div>
    </HeaderLayout>
  );
}
