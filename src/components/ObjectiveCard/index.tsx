
import { useState } from "react";
import CreateKeyResultModal from "../Modal/KeyResult/create";
import EditKeyResultModal from "../Modal/KeyResult/edit";
import { Objectives, Objective } from "@/pages/okr/objective/[projectId]";

interface ObjectiveCardProps {
  objective: Objective;
  setObjective: React.Dispatch<React.SetStateAction<Objectives[]>>;
}

export default function ObjectiveCard(props: Readonly<ObjectiveCardProps>) {
  // Variáveis de estado para controle dos modais de criação e edição
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  // Extraindo os dados do objetivo de forma mais simples de manipular
  console.log('props', props)
  const { objective } = props;
  const { id, objective_name, description, key_results } = objective;

  function handleAddKeyResult() {
    setOpenModal(true);
    // Exemplo de como atualizar o objetivo com um novo key result:
    // const novoResultado = prompt("Digite o novo Resultado Chave:");
    // if (!novoResultado || novoResultado.trim() === "") return;
    // props.setObjective((prevObjectives: Objective[]) =>
    //   prevObjectives.map((obj) =>
    //     obj.object.id === id
    //       ? {
    //           ...obj,
    //           object: {
    //             ...obj.object,
    //             key_results: [
    //               ...obj.object.key_results,
    //               // Adicione aqui o novo key result com as informações necessárias
    //               {
    //                 id: new Date().getTime(), // Exemplo: gerar um ID
    //                 objective_id: id,
    //                 key_result_name: novoResultado,
    //                 description: "",
    //                 status: "pending",
    //                 start_date: new Date(),
    //                 end_date: new Date(),
    //                 crated_at: new Date(),
    //                 updated_at: new Date()
    //               }
    //             ]
    //           }
    //         }
    //       : obj
    //   )
    // );
  }

  function handleEditKeyResult(result: string) {
    console.log(result);
    setOpenEditModal(true);
    // Exemplo: implementar atualização do key result conforme necessário
  }

  return (
    <div
      key={id}
      className="bg-gray-100 rounded-lg shadow-md w-[300px] h-[calc(100vh-210px)] p-4 flex flex-col flex-shrink-0"
    >
      <div className="text-lg font-semibold text-gray-700 mb-5">
        {objective_name}
      </div>

      <p className="text-sm text-gray-500 mb-4">
        {description}
      </p>

      <div className="mt-[80%]">
        <p className="text-gray-600 font-medium mb-2">
          Resultados Chaves
        </p>
        <ul className="space-y-2 mb-2">
          {key_results.map((result, index) => (
            <li
              key={index}
              className="bg-blue-100 text-blue-600 p-2 rounded-lg flex justify-between items-center shadow-sm"
            >
              <span>{result.key_result_name}</span>
              <button onClick={() => handleEditKeyResult(result.key_result_name)} className="text-gray-500 hover:text-gray-700">
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
      {openModal && (
        <CreateKeyResultModal
          onClose={setOpenModal}
          open={openModal}
          addKeyResult={handleAddKeyResult}
        />
      )}
      {openEditModal && (
        <EditKeyResultModal
          onClose={setOpenEditModal}
          open={openEditModal}
          editKeyResult={() => {}}
        />
      )}
    </div>
  );
}