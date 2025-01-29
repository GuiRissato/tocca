import { useState } from "react";
import CreateKeyResultModal from "../Modal/KeyResult/create";
import { Objective } from "@/pages/okr/objective/[projectId]";
import EditKeyResultModal from "../Modal/KeyResult/edit";

type objective = {
  id: number;
    title: string;
    description: string;
    results: string[];
  };

interface ObjectiveCardProps {
  objective: objective;
  setObjective:  React.Dispatch<React.SetStateAction<objective[]>>;
}
export default function ObjectiveCard(props: Readonly<ObjectiveCardProps>) {

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);

  function handleAddKeyResult() {
    setOpenModal(true);
    // const novoResultado = prompt("Digite o novo Resultado Chave:");
    // if (!novoResultado || novoResultado.trim() === "") return;
  
    // props.setObjective((prevObjectives: objective[]) =>
    //   prevObjectives.map((obj: objective) =>
    //     obj.id === props.objective.id
    //       ? {
    //           ...obj,
    //           results: [...obj.results, novoResultado],
    //         }
    //       : obj
    //   )
    // );
  }

  function handleEditKeyResult(result: string) {
    console.log(result)
    setOpenEditModal(true)
  }

  return (
    <div
      key={props.objective.id}
      className="bg-gray-100 rounded-lg shadow-md w-[300px] h-[calc(100vh-210px)] p-4 flex flex-col flex-shrink-0"
    >
      <div className="text-lg font-semibold text-gray-700 mb-5">
        {props.objective.title}
      </div>

      <p className="text-sm text-gray-500 mb-4">{props.objective.description}</p>

      <div className="mt-[80%]">
        <p className="text-gray-600 font-medium mb-2">
          Resultados Chaves
        </p>
        <ul className="space-y-2 mb-2">
          {props.objective.results.map((result, resultIndex) => (
            <li
              key={resultIndex}
              className="bg-blue-100 text-blue-600 p-2 rounded-lg flex justify-between items-center shadow-sm"
            >
              <span>{result}</span>
              <button onClick={()=>{handleEditKeyResult(result)}} className="text-gray-500 hover:text-gray-700">
                ...
              </button>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={handleAddKeyResult}
        className="space-y-2 w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-lg"
      >
        + Criar Resultados Chaves
      </button>
      {openModal && 
      <CreateKeyResultModal 
        onClose={setOpenModal} open={openModal} addKeyResult={handleAddKeyResult}
        />}
      {
        openEditModal &&
        <EditKeyResultModal
          onClose={setOpenEditModal} open={openEditModal} editKeyResult={()=>{}}
          />
      }
    </div>
  );
}