import React, { useState } from "react";
import HeaderLayout from "@/components/HeaderLayout";
import "../../app/globals.css";
import SelectYearButton from "@/components/SelectYearButton";
import { bouncy } from 'ldrs'

bouncy.register()
export default function ReportPage() {
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [selectedOkr, setSelectedOkr] = useState<number | null>(null);
  const [loadingSection, setLoadingSection] = useState<number | null>(null);

  const handleSectionClick = (sectionIndex: number) => {
    setLoadingSection(sectionIndex);

    setTimeout(() => {
      setLoadingSection(null);
    }, 2000);
  };

  return (
    <HeaderLayout>
      <div className="container mx-auto pt-[60px] mt-10 mb-10">
        <div className="flex items-center justify-between px-8 py-6">

          {/* OKR Selection Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={() => setSelectedOkr(1)}
              className={`
                rounded-full px-4 py-2 transition 
                bg-[#D8D8D8] 
                hover:bg-gray-300
                text-black
                ${
                  selectedOkr === 1
                    ? "border-2 border-blue-500"
                    : "border-2 border-transparent"
                }
              `}
            >
              OKR 1º Trimestre
            </button>

            <button
              onClick={() => setSelectedOkr(2)}
              className={`
                rounded-full px-4 py-2 transition 
                bg-[#D8D8D8] 
                hover:bg-gray-300
                text-black
                ${
                  selectedOkr === 2
                    ? "border-2 border-blue-500"
                    : "border-2 border-transparent"
                }
              `}
            >
              OKR 2º Trimestre
            </button>

            <button
              onClick={() => setSelectedOkr(3)}
              className={`
                rounded-full px-4 py-2 transition
                bg-[#D8D8D8]
                hover:bg-gray-300
                text-black
                ${
                  selectedOkr === 3
                    ? "border-2 border-blue-500"
                    : "border-2 border-transparent"
                }
              `}
            >
              OKR 3º Trimestre
            </button>

            <button
              onClick={() => setSelectedOkr(4)}
              className={`
                rounded-full px-4 py-2 transition 
                bg-[#D8D8D8] 
                hover:bg-gray-300
                text-black
                ${
                  selectedOkr === 4
                    ? "border-2 border-blue-500"
                    : "border-2 border-transparent"
                }
              `}
            >
              OKR 4º Trimestre
            </button>
          </div>


          {/* Year Selection Button */}
          <SelectYearButton years={[2023, 2024]} setSelectedYear={setSelectedYear} selectedYear={selectedYear} />
        </div>

        {/* Example Buttons for Additional Sections */}
        <div className="flex flex-1 justify-center items-center gap-8 h-[calc(100vh-300px)] ">
          <button
            onClick={() => handleSectionClick(1)}
            className={`
              ${
                loadingSection === 1
                   ? "bg-gray-400 text-white"
                  : "bg-[#D8D8D8] hover:bg-gray-400 text-black"
              }
              text-center px-6 py-4 rounded-xl w-[430px] transition h-[70px]
            `}
          >
            {loadingSection === 1 ? 
            <l-bouncy
              size={'45'}
              speed='1.75'
              color={'black'}
            /> : "Progresso do OKR"}
          </button>

          <button
            onClick={() => handleSectionClick(2)}
            className={`
              ${
                loadingSection === 2
                  ? "bg-gray-400 text-white"
                  : "bg-[#D8D8D8] hover:bg-gray-400 text-black"
              }
              text-center px-6 py-4 rounded-xl w-[430px] transition h-[70px]
            `}
          >
            {loadingSection === 2 ? 
             <l-bouncy
             size={'45'}
             speed='1.75'
             color={'black'}
             /> : "Desempenho das Tarefas"}
          </button>

          <button
            onClick={() => handleSectionClick(3)}
            className={`
              ${
                loadingSection === 3
                  ? "bg-gray-400 text-white"
                  : "bg-[#D8D8D8] hover:bg-gray-400 text-black"
              }
              text-center px-6 py-4 rounded-xl w-[430px] transition h-[70px]
            `}
          >
            {loadingSection === 3 ?  <l-bouncy
              size={'45'}
              speed='1.75'
              color={'black'}
            /> : "Prazos e Datas Importantes"}
          </button>
        </div>
      </div>
    </HeaderLayout>
  );
}