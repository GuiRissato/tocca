import {useRouter} from "next/router";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export interface Project {
  id: number;
  company_id: number;
  project_name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface OKRData {
  project: Project;
  objectivesProgress: number;
  keyResultsProgress: number;
}

interface OKRCardProps {
  data?: OKRData;
}

export default function OKRCard(props: Readonly<OKRCardProps>) {
  const router = useRouter();
  const handleNavigate = (projectId: number) =>{
    router.push(`/okr/objective/${projectId}`);
  }
  return (
    <div className="relative bg-[#F4F4F5] rounded-[20px] w-[100%] h-[230px] flex justify-around shadow-lg p-6"
      onClick={() => handleNavigate(Number(props.data?.project.id))}
    >
      <div className="flex flex-col justify-center">
        <h3 className="text-2xl font-semibold text-gray-800">{props.data?.project.project_name}</h3>
      </div>

      <div className="flex flex-col items-center justify-center space-y-4">
        <p className="text-black-500 text-lg font-medium">Progresso</p>
        <div className="flex space-x-8">
          <div className="flex flex-col items-center">
            <p className="text-gray-600 font-medium text-sm mb-2">Objetivos</p>
            <div className="w-[120px] h-[120px]">
              <CircularProgressbar
                value={Number(props.data?.objectivesProgress)}
                text={`${props.data?.objectivesProgress}%`}
                styles={buildStyles({
                  textSize: "14px",
                  pathColor: "#10B981",
                  textColor: "#1F2937",
                  trailColor: "#D1D5DB",
                })}
              />
            </div>
          </div>

          <div className="flex flex-col items-center">
            <p className="text-gray-600 font-medium text-sm mb-2">
              Resultados Chaves
            </p>
            <div className="w-[120px] h-[120px]">
              <CircularProgressbar
                value={Number(props.data?.keyResultsProgress)}
                text={`${props.data?.keyResultsProgress}%`}
                styles={buildStyles({
                  textSize: "14px",
                  pathColor: "#10B981",
                  textColor: "#1F2937",
                  trailColor: "#D1D5DB",
                })}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
