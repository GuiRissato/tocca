import HeaderLayout from '@/components/HeaderLayout';
import '../../app/globals.css'
import OKRGrid from "../../components/OKRGrid";
import { useState } from 'react';
import SelectYearButton from '@/components/SelectYearButton';

export default function OKRPage() {

  const [selectedYear, setSelectedYear] = useState<number>(2024);

  return (
    <HeaderLayout>
    <div className="container mx-auto pt-[60px] mt-10 mb-10">
      <header className="mb-4">
        <SelectYearButton years={[2023,2024]} setSelectedYear={setSelectedYear} selectedYear={selectedYear} />
      </header>
      <OKRGrid selectedYear={selectedYear} />
    </div>
  </HeaderLayout>
  );
}
