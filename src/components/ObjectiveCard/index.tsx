import { useState } from "react";
import CreateKeyResultModal from "../Modal/KeyResult/create";
import EditKeyResultModal from "../Modal/KeyResult/edit";
import { Objective } from "@/pages/okr/objective/[projectId]";

interface ObjectiveCardProps {
  objective: Objective;
  setObjective: React.Dispatch<React.SetStateAction<Objective[]>>;
}

export default function ObjectiveCard(props: Readonly<ObjectiveCardProps>) {
  // Variáveis de estado para controle dos modais de criação e edição
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  // Extraindo os dados do objetivo de forma mais simples de manipular
  console.log('props', props)
  const { objective } = props;
  const { id, objective_name, description, key_results, start_date, end_date, status } = objective;

  // Format dates for display
  const formatDate = (date: Date | undefined) => {
    if (!date) return "Não definida";
    return new Date(date).toLocaleDateString('pt-BR');
  };

  // Get status display text
  const getStatusText = (statusValue: string | undefined) => {
    if (!statusValue) return "Não definido";
    
    const statusMap: Record<string, string> = {
      'active': 'Ativo',
      'inactive': 'Inativo',
      'completed': 'Concluído',
      'pending': 'Pendente'
    };
    
    return statusMap[statusValue] || statusValue;
  };

  // Get status color class
  const getStatusColorClass = (statusValue: string | undefined) => {
    if (!statusValue) return "bg-gray-200 text-gray-600";
    
    const statusColorMap: Record<string, string> = {
      'active': "bg-green-100 text-green-600",
      'inactive': "bg-gray-100 text-gray-600",
      'completed': "bg-blue-100 text-blue-600",
      'pending': "bg-yellow-100 text-yellow-600"
    };
    
    return statusColorMap[statusValue] || "bg-gray-200 text-gray-600";
  };

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

      {/* Informações adicionais do objetivo */}
      <div className="mb-4 space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-600 font-medium">Status:</span>
          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColorClass(status)}`}>
            {getStatusText(status)}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-600 font-medium">Data de início:</span>
          <span className="text-gray-700">{formatDate(start_date)}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-600 font-medium">Data de término:</span>
          <span className="text-gray-700">{formatDate(end_date)}</span>
        </div>
      </div>

      <div className="mt-auto">
        <p className="text-gray-600 font-medium mb-2">
          Resultados Chaves
        </p>
        <ul className="space-y-2 mb-2 max-h-[200px] overflow-y-auto">
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
        className="mt-2 w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-lg"
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