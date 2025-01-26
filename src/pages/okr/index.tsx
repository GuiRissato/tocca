import HeaderLayout from '@/components/HeaderLayout';
import '../../app/globals.css'
import OKRGrid from "../../components/OKRGrid";
import { useState } from 'react';

export default function OKRPage() {

  const [years, setYears] = useState<number[]>([2023,2024]);
  const [selectedYear, setSelectedYear] = useState<number>(2023);
  

  return (
    <HeaderLayout>
    <div className="container mx-auto pt-[60px] mt-10 mb-10">
      <header className="mb-4">
        <div className="relative w-64">
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
      <OKRGrid selectedYear={selectedYear} />
    </div>
  </HeaderLayout>
  );
}
