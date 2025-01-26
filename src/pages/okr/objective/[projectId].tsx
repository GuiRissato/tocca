import { useState } from "react";
import HeaderLayout from "@/components/HeaderLayout";
import "../../../app/globals.css";

export default function OKRPage() {
  const [years, setYears] = useState<number[]>([2023,2024]);
  const [selectedYear, setSelectedYear] = useState<number>(2023);
  
  const [objectives, setObjectives] = useState([
    { id: 1, title: "Objetivo 1", description: "Descrição", results: ["Resultado 1", "Resultado 2", "Resultado 3"] },
    { id: 2, title: "Objetivo 2", description: "Descrição", results: ["Resultado 1", "Resultado 2", "Resultado 3"] },
    { id: 3, title: "Objetivo 3", description: "Descrição", results: ["Resultado 1", "Resultado 2", "Resultado 3"] },
    { id: 4, title: "Objetivo 4", description: "Descrição", results: ["Resultado 1", "Resultado 2", "Resultado 3"] },
  ]);

  const addObjective = () => {
    const newId = objectives.length + 1;
    setObjectives([
      ...objectives,
      { id: newId, title: `Objetivo ${newId}`, description: "Nova Descrição", results: [] },
    ]);
  };

  return (
    <HeaderLayout>
      {/* Layout Principal com Altura da Tela e Scroll Horizontal */}
      <div className="container mx-auto pt-[60px] mt-10 mb-10">
      <header className="ml-6 mb-4">
        <div className="flex w-64">
          <select
            className="block w-full px-4 py-2 text-gray-700 bg-[#F4F4F5] rounded-full border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {years.length > 0 ? (
              years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))
            ) : (
              <option>Carregando...</option>
            )}
          </select>
        </div>
      </header>
      <div className="flex h-full items-center space-x-6 px-6">
            {/* Cards de Objetivos */}
            {objectives.map((objective) => (
              <div
                key={objective.id}
                className="bg-gray-100 rounded-lg shadow-md w-[300px] h-[calc(100vh-210px)] p-4 flex flex-col flex-shrink-0"
              >
                {/* Título do Objetivo */}
                <div className="text-lg font-semibold text-gray-700 mb-5">
                  {objective.title}
                </div>

                {/* Descrição */}
                <p className="text-sm text-gray-500 mb-4">{objective.description}</p>

                {/* Resultados-Chave */}
                <div className="mt-[80%]">
                  <p className="text-gray-600 font-medium mb-2">
                    Resultados Chaves
                  </p>
                  <ul className="space-y-2 mb-2">
                    {objective.results.map((result, resultIndex) => (
                      <li
                        key={resultIndex}
                        className="bg-blue-100 text-blue-600 p-2 rounded-lg flex justify-between items-center shadow-sm"
                      >
                        <span>{result}</span>
                        <button className="text-gray-500 hover:text-gray-700">
                          ...
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Botão de Criar Resultados */}
                <button className="space-y-2 w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-lg">
                  + Criar Resultados Chaves
                </button>
              </div>
            ))}

            {/* Card para criar novo Objetivo */}
            <div className="bg-gray-200 rounded-lg shadow-md w-[300px] h-[90%] flex items-center justify-center p-3 flex-shrink-0">
              <button
                onClick={addObjective}
                className="text-gray-600 text-lg font-medium hover:text-gray-800"
              >
                + Criar Objetivo
              </button>
            </div>
          </div>
      </div>
    </HeaderLayout>
  );
}