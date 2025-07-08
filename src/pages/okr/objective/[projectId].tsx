/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import HeaderLayout from "@/components/HeaderLayout";
import "../../../app/globals.css";
import ObjectiveCard from "@/components/ObjectiveCard";
import ObjectiveModal from "@/components/Modal/Objective/create";
import { wrapper } from "@/store";
import { GetServerSidePropsResult } from "next";
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
  objectives: Objective[];
}

export const getServerSideProps = wrapper.getServerSideProps(
  () =>
    async (context): Promise<GetServerSidePropsResult<OKRPageProps>> => {

      try {
        const baseUrl = process.env.SITE_URL ?? `${context.req.headers['x-forwarded-proto']}://${context.req.headers.host}`;

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
            objectives: objectivesData,
          },
        };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error("Erro na requisição:", error);
        return {
          props: {
            objectives: [],
          },
        };
      }
    }
);


export default function ObjectivesPage({ objectives: initialObjectives }: Readonly<OKRPageProps>) {
  const [openModal, setOpenModal] = useState(false);
  
  const [objectives, setObjectives] = useState<Objective[]>(initialObjectives);
  const router = useRouter();
  const { projectId } = router.query;

  const fetchObjectives = async () => {
    if (!projectId) return;

    try {
      const response = await fetch(`${process.env.SITE_URL}/api/objectives/keyresults/${projectId}`, {
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