import HeaderLayout from '@/components/HeaderLayout';
import '../../app/globals.css'
import OKRGrid from "../../components/OKRGrid";
import { useState } from 'react';
import SelectYearButton from '@/components/SelectYearButton';
import { wrapper } from '@/store';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from '../login';
import { GetServerSideProps } from 'next';

type OKRPageProps = {
  initialYear: number;
  availableYears: number[];
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async (context: GetServerSideProps) => {

      let initialYear = new Date().getFullYear();
      let availableYears: number[] = [];
      
      let userJwt: DecodedToken | null = null;

      if (context.req.cookies.userJWT) {
        const parsedCookies: DecodedToken = jwtDecode(context.req.cookies.userJWT);
        userJwt = parsedCookies;
      }
      try {
        
        const response = await fetch('/api/okr/years', {
          method: 'GET',
        });

        // const data = await response.json();
        
        // let availableYears: number[] = [];
        // if (Array.isArray(data)) {
        //   availableYears = data;
        // }

        // const initialYear =
        //   availableYears.length > 0
        //     ? availableYears[0]
        //     : new Date().getFullYear();

        // return {
        //   props: {
        //     initialYear,
        //     availableYears,
        //   },
        // };
      } catch (error) {
       console.log('error', error) 
       return {
        props: {
          initialYear: 2025,
          availableYears: 2025
        }
       }
      }
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
