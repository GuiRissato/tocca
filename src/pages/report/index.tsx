import "../../app/globals.css";
import React, { useEffect, useState } from "react";
import HeaderLayout from "@/components/HeaderLayout";
import SelectYearButton from "@/components/SelectYearButton";
import OKRProgress from "@/components/Reports/OkrProgress";
import TaskPerformance from "@/components/Reports/TasksPerfomance";
import Deadlines from "@/components/Reports/Deadlines";
import { RootState, wrapper } from "@/store";
import { GetServerSidePropsResult } from "next";
import { DecodedToken } from "../login";
import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let bouncy: any;
if (typeof window !== "undefined") {
  import('ldrs').then(module => {
    bouncy = module.bouncy;
    bouncy.register();
  });
}

export const getServerSideProps = wrapper.getServerSideProps(
  () =>
    async (
      context
    ): Promise<
      GetServerSidePropsResult<{
        initialYear?: number;
        availableYears?: number[];
        error?: string;
      }>
    > => {
      let userJwt: DecodedToken | null = null;

      if (context.req.cookies.userJWT) {
        const parsedCookies: DecodedToken = jwtDecode(context.req.cookies.userJWT);
        userJwt = parsedCookies;
      }
      try {
        const baseUrl = `${context.req.headers['x-forwarded-proto']}://${context.req.headers.host}`;
        const response = await fetch(
          `${baseUrl}/api/okr/years?companyId=${userJwt?.user.companyId}`,
          {
            method: 'GET',
          }
        );

        if (!response.ok) {
          throw new Error(`Erro: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();

        let availableYears: number[] = [];
        if (Array.isArray(data)) {
          availableYears = data;
        }

        const initialYear = availableYears.length > 0 ? availableYears[0] : new Date().getFullYear();

        return {
          props: {
            initialYear,
            availableYears,
          },
        };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {

        console.error('Erro na requisição:', error);
        return {
          props: {
            error: error.message ?? 'Ocorreu um erro na requisição.',
          },
        };
      }
    }
);

interface ReportProps {
  initialYear: number;
  availableYears: number[];
}

export default function ReportPage({initialYear, availableYears}: Readonly<ReportProps>) {
  const [selectedYear, setSelectedYear] = useState<number>(initialYear);
  const [selectedOkr, setSelectedOkr] = useState<number | null>(null);
  const [okrData, setOkrData] = useState<{project_name: string; id: number}[] | null>(null);
  const user = useSelector((state: RootState) => state.user);

  useEffect(()=>{
    if(selectedYear && user.companyId){
      fetchAllOkrsNames(user.companyId, selectedYear)
    }
  },[
    selectedYear, user.companyId
  ])

  const fetchAllOkrsNames = async (companyId: number, year: number) =>{
    try {
      
      const response = await fetch(`/api/okr/names/${companyId}/${year}`,{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json();

      setOkrData(data)
    } catch (error) {
      console.error('Erro ao buscar OKRs:', error);
    }
  }

  return (
    <HeaderLayout>
      <div className="container mx-auto pt-[60px] mt-10 mb-10">
        <div className="flex items-center justify-between px-8 py-6">

          <div className="flex space-x-4 overflow-x-auto">
            {okrData && okrData.length > 0 ? (
              okrData.map((okr) => (
                <button
                  key={okr.id}
                  onClick={() => setSelectedOkr(okr.id)}
                  className={`
                    rounded-full px-4 py-2 transition 
                    bg-[#D8D8D8] 
                    hover:bg-gray-300
                    text-black
                    whitespace-nowrap
                    ${
                      selectedOkr === okr.id
                        ? "border-2 border-blue-500"
                        : "border-2 border-transparent"
                    }
                  `}
                >
                  {okr.project_name}
                </button>
              ))
            ) : (
              <div className="text-gray-500 italic">
                {selectedYear ? "Nenhum OKR encontrado para este ano" : "Selecione um ano para ver os OKRs disponíveis"}
              </div>
            )}
          </div>

          <SelectYearButton years={availableYears} setSelectedYear={setSelectedYear} selectedYear={selectedYear} />
        </div>

        <div className="flex flex-1 justify-center items-center gap-8 h-[calc(100vh-300px)] ">
         <OKRProgress selectedOkr={Number(selectedOkr)} selectedYear={selectedYear}/>

          <TaskPerformance selectedOkr={Number(selectedOkr)} selectedYear={selectedYear}/>

          <Deadlines selectedOkr={Number(selectedOkr)} selectedYear={selectedYear}/>
        </div>
      </div>
    </HeaderLayout>
  );
}