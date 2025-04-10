import { useState } from "react";

type year = number[];

interface SelectYearButtonProps {
    years: year;
    setSelectedYear: (value: number) => void;
    selectedYear: number;
}
export default function SelectYearButton(props: Readonly<SelectYearButtonProps>) {

      const [years] = useState<number[]>(props.years);
      
    return (
        <div className="relative w-64">
        <select
          className="block w-full px-4 py-2 text-gray-700 bg-[#D8D8D8] rounded-full border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={Number(props.selectedYear)}
          onChange={(e) => props.setSelectedYear(Number(e.target.value))}
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
    );
  }