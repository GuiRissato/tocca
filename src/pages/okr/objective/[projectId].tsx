import { useEffect, useState } from "react";
import HeaderLayout from "@/components/HeaderLayout";
import "../../../app/globals.css";
import ObjectiveCard from "@/components/ObjectiveCard";
import ObjectiveModal from "@/components/Modal/Objective/create";
import SelectYearButton from "@/components/SelectYearButton";
import { wrapper } from "@/store";
import { GetServerSidePropsResult } from "next";
import { DecodedToken } from "@/pages/login";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/router";

export interface KeyResult {
  id: number;
  objective_id: number;
  key_result_name: string;
  description: string;
  status: string;
  start_date: Date;
  end_date: Date;
  crated_at: Date;
  updated_at: Date;
}

export interface Objective {
  id: number;
  objective_name: string;
  description?: string;
  status?: string;
  start_date?: Date;
  end_date?: Date;
  crated_at?: Date;
  updated_at?: Date;
  key_results: KeyResult[];
}
export interface OKRPageProps {
  initialYear: number;
  availableYears: number[];
  objectives: Objective[];
}

export const getServerSideProps = wrapper.getServerSideProps(
  () =>
    async (context): Promise<GetServerSidePropsResult<OKRPageProps>> => {
      let userJwt: DecodedToken | null = null;
      if (context.req.cookies.userJWT) {
        try {
          userJwt = jwtDecode(context.req.cookies.userJWT);
        } catch (error) {
          console.error("Falha ao decodificar o JWT:", error);
        }
      }

      try {
        const protocol = context.req.headers["x-forwarded-proto"] || "http";
        const host = context.req.headers.host;
        const baseUrl = `${protocol}://${host}`;

        const yearsResponse = await fetch(
          `${baseUrl}/api/okr/years?companyId=${userJwt?.user.companyId}`,
          {
            method: "GET",
          }
        );

        if (!yearsResponse.ok) {
          throw new Error(`Erro na requisição de anos: ${yearsResponse.status} - ${yearsResponse.statusText}`);
        }
        const yearsData = await yearsResponse.json();
        const availableYears: number[] = Array.isArray(yearsData) ? yearsData : [];
        const initialYear = availableYears.length > 0 ? availableYears[0] : new Date().getFullYear();

        const { projectId } = context.params || {};
        if (!projectId) {
          throw new Error("Project ID is missing in the URL parameters.");
        }
        const objectivesResponse = await fetch(
          `${baseUrl}/api/objectives/keyresults/${projectId}`,
          {
            method: "GET",
          }
        );

        if (!objectivesResponse.ok) {
          throw new Error(`Erro na requisição de objetivos: ${objectivesResponse.status} - ${objectivesResponse.statusText}`);
        }
        const objectivesData = await objectivesResponse.json();

        return {
          props: {
            initialYear,
            availableYears,
            objectives: objectivesData,
          },
        };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error("Erro na requisição:", error);
        return {
          props: {
            initialYear: new Date().getFullYear(),
            availableYears: [],
            objectives: [],
          },
        };
      }
    }
);


export default function ObjectivesPage({ initialYear, availableYears, objectives: initialObjectives }: Readonly<OKRPageProps>) {
  const [selectedYear, setSelectedYear] = useState<number>(initialYear);
  const [years] = useState<number[]>(availableYears);
  const [openModal, setOpenModal] = useState(false);
  
  const [objectives, setObjectives] = useState<Objective[]>(initialObjectives);
  const router = useRouter();
  const { projectId } = router.query;

  const fetchObjectives = async () => {
    if (!projectId) return;

    try {
      const response = await fetch(`/api/objectives/keyresults/${projectId}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Erro na requisição de objetivos: ${response.status}`);
      }

      const data = await response.json();
      setObjectives(data);
    } catch (error) {
      console.error("Erro ao buscar objetivos:", error);
      alert("Ocorreu um erro ao buscar os objetivos. Por favor, tente novamente.");
    }
  };

  const addObjective = () => {
    setOpenModal(true);
  };

  useEffect(() => {
    if(!openModal){
      fetchObjectives()
    }
  }, [openModal]);

  return (
    <HeaderLayout>
      {/* Layout Principal com Altura da Tela e Scroll Horizontal */}
      <div className="container mx-[5%] pt-[60px] mt-10 mb-10">
      <header className="mb-4">
        <SelectYearButton years={years} setSelectedYear={setSelectedYear} selectedYear={selectedYear}/>
      </header>
      <div className="flex w-full h-full items-center space-x-6">
            {objectives.map(( objective: Objective ) => {
              return(
              <ObjectiveCard objective={objective as unknown as Objective} key={objective.id} setObjective={setObjectives}/>
            )})}

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
          {openModal && <ObjectiveModal onClose={setOpenModal} open={openModal} addObjective={addObjective}/>}
      </div>
      
    </HeaderLayout>
  );
}