import { useState } from "react";
import HeaderLayout from "@/components/HeaderLayout";
import "../../../app/globals.css";
import ObjectiveCard from "@/components/ObjectiveCard";
import ObjectiveModal from "@/components/Modal/Objective/create";

export interface Objective {
  id: number;
  title: string;
  description: string;
  results: string[];
}

export interface KeyResult {
  id: number;
  key_result_name: string;
  description: string;
}

export default function OKRPage() {
  const [years, setYears] = useState<number[]>([2023,2024]);
  const [selectedYear, setSelectedYear] = useState<number>(2023);
  const [openModal, setOpenModal] = useState(false);
  
  const [objectives, setObjectives] = useState<Objective[]>([
    { id: 1, title: "Objetivo 1", description: "Descrição", results: ["Resultado 1", "Resultado 2", "Resultado 3"] },
    { id: 2, title: "Objetivo 2", description: "Descrição", results: ["Resultado 1", "Resultado 2", "Resultado 3"] },
    { id: 3, title: "Objetivo 3", description: "Descrição", results: ["Resultado 1", "Resultado 2", "Resultado 3"] },
    { id: 4, title: "Objetivo 4", description: "Descrição", results: ["Resultado 1", "Resultado 2", "Resultado 3"] },
  ]);

  const addObjective = () => {
    setOpenModal(true);
    // const newId = objectives.length + 1;
    // setObjectives([
    //   ...objectives,
    //   { id: newId, title: `Objetivo ${newId}`, description: "Nova Descrição", results: [] },
    // ]);
  };

  return (
    <HeaderLayout>
      {/* Layout Principal com Altura da Tela e Scroll Horizontal */}
      <div className="container mx-auto pt-[60px] mt-10 mb-10">
      <header className="ml-6 mb-4">
        <div className="flex w-64">
          <label
            className="block w-full px-4 py-2 text-gray-700 bg-[#F4F4F5] rounded-full border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
           {selectedYear}
          </label>
        </div>
      </header>
      <div className="flex h-full items-center space-x-6 px-6">
            {/* Cards de Objetivos */}
            {objectives.map((objective, index) => (
              <ObjectiveCard objective={objective} key={index} setObjective={setObjectives}/>
            ))}

            {/* Card para criar novo Objetivo */}
            <div
             className="bg-gray-200 rounded-lg shadow-md w-[300px] h-[90%] flex items-center justify-center p-3 flex-shrink-0 cursor-pointer" 
             onClick={addObjective}
             >
              <button
                
                className="text-gray-600 text-lg font-medium hover:text-gray-800"
              >
                + Criar Objetivo
              </button>
            </div>
          </div>
          {openModal && <ObjectiveModal onClose={setOpenModal} open={openModal} addObjective={addObjective} />}
      </div>
      
    </HeaderLayout>
  );
}