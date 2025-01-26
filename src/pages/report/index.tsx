import React from "react";
import HeaderLayout from "@/components/HeaderLayout";
import "../../app/globals.css";

export default function ReportPage() {
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
          <select
            className="bg-[#D8D8D8] px-4 py-2 rounded-md shadow
                       hover:bg-gray-300 transition focus:outline-none"
          >
            <option value="">Selecione o ano</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
          </select>
        </div>

        {/*
          Área principal:
          flex-1 = ocupa todo o espaço vertical restante
          justify-center e items-center = centralizam os cards no meio
        */}
        <div className="flex flex-1 justify-center items-center gap-8 h-[calc(100vh-300px)]">
          <button className="bg-gray-300 text-center px-6 py-4 rounded-xl w-64 hover:bg-gray-400 transition">
            <h2 className="font-semibold text-lg mb-2">Progresso do OKR</h2>
          </button>

          <button className="bg-gray-300 text-center px-6 py-4 rounded-xl w-64 hover:bg-gray-400 transition">
            <h2 className="font-semibold text-lg mb-2">Desempenho das Tarefas</h2>
          </button>

          <button className="bg-gray-300 text-center px-6 py-4 rounded-xl w-64 hover:bg-gray-400 transition">
            <h2 className="font-semibold text-lg mb-2">Prazos e Datas Importantes</h2>
          </button>
        </div>
      </div>
    </HeaderLayout>
  );
}
