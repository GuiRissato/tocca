import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface OKRCardProps {
    title: string;
    progress: number;
  }

export default function OKRCard(props: Readonly<OKRCardProps>) {
    return (
            <div className="bg-white p-6 rounded shadow-sm">
              <h3 className="text-lg font-bold mb-4">{props.title}</h3>
              <div className="flex justify-between items-center space-x-4">
                <div className="w-16 h-16">
                  <p className="text-gray-600">Objetivos</p>
                  <CircularProgressbar
                    value={props.progress}
                    text={`${props.progress}%`}
                    styles={buildStyles({
                      textSize: "12px",
                      pathColor: "#34D399", // Tailwind: green-400
                      textColor: "#374151", // Tailwind: gray-700
                      trailColor: "#E5E7EB", // Tailwind: gray-200
                    })}
                  />
                </div>
                <div className="w-16 h-16">
                  <p className="text-gray-600">Resultados Chaves</p>
                  <CircularProgressbar
                    value={props.progress}
                    text={`${props.progress}%`}
                    styles={buildStyles({
                      textSize: "12px",
                      pathColor: "#34D399", // Tailwind: green-400
                      textColor: "#374151", // Tailwind: gray-700
                      trailColor: "#E5E7EB", // Tailwind: gray-200
                    })}
                  />
                </div>
              </div>
            </div>
    );
  }
  