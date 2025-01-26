import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface OKRCardProps {
  title: string;
  progress: number;
}

export default function OKRCard(props: Readonly<OKRCardProps>) {
  return (
    <div className="relative bg-[#F4F4F5] rounded-[20px] w-[100%] h-[230px] flex justify-around shadow-lg p-6">
      <div className="flex flex-col justify-center">
        <h3 className="text-2xl font-semibold text-gray-800">{props.title}</h3>
      </div>

      <div className="flex flex-col items-center justify-center space-y-4">
        <p className="text-black-500 text-lg font-medium">Progresso</p>
        <div className="flex space-x-8">
          <div className="flex flex-col items-center">
            <p className="text-gray-600 font-medium text-sm mb-2">Objetivos</p>
            <div className="w-[120px] h-[120px]">
              <CircularProgressbar
                value={props.progress}
                text={`${props.progress}%`}
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
                value={props.progress}
                text={`${props.progress}%`}
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
