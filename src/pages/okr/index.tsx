import HeaderLayout from '@/components/HeaderLayout';
import '../../app/globals.css'
import OKRGrid from "../../components/OKRGrid";
import { useState } from 'react';
import SelectYearButton from '@/components/SelectYearButton';
import { GetServerSideProps } from 'next';
import toccaAPI from '../../../api';
import { wrapper } from '@/store';

type OKRPageProps = {
  initialYear: number;
  availableYears: number[];
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async () => {
      const state = store.getState();
      const { companyId } = state.user;

      const safeCompanyId = companyId ?? 2;

      const response = await fetch(`/api/okr/${safeCompanyId}/years`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      var availableYears: number[] = [];
      if (Array.isArray(data)) {
        availableYears = data;
      }

      // Define o ano inicial
      const initialYear =
        availableYears.length > 0
          ? availableYears[0]
          : new Date().getFullYear();

      return {
        props: {
          initialYear,
          availableYears,
        },
      };
    }
);


export default function OKRPage({initialYear, availableYears}: Readonly<OKRPageProps>) {

  const [selectedYear, setSelectedYear] = useState<number>(initialYear);
  const [years, setYears] = useState<number[]>(availableYears);

  return (
    <HeaderLayout>
    <div className="container mx-auto pt-[60px] mt-10 mb-10">
      <header className="mb-4">
        <SelectYearButton years={years} setSelectedYear={setSelectedYear} selectedYear={selectedYear} />
      </header>
      <OKRGrid selectedYear={selectedYear} />
    </div>
  </HeaderLayout>
  );
}
