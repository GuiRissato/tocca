import { useState } from "react";
import CreateKeyResultModal from "../Modal/KeyResult/create";
import EditKeyResultModal from "../Modal/KeyResult/edit";
import { Objective, KeyResult } from "../../pages/okr/objective/[projectId]";
import { useRouter } from "next/router";
import EditObjectiveModal from "../Modal/Objective/edit";

interface ObjectiveCardProps {
  objective: Objective;
  setObjective: React.Dispatch<React.SetStateAction<Objective[]>>;
}

export default function ObjectiveCard(props: Readonly<ObjectiveCardProps>) {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [openEditObjectiveModal, setOpenEditObjectiveModal] = useState<boolean>(false);
  const [selectedKeyResult, setSelectedKeyResult] = useState<KeyResult | null>(null);
  const { objective, setObjective } = props;
  const { id, objective_name, description, key_results, start_date, end_date, status } = objective;

  const router = useRouter();

  const formatDate = (date: Date | undefined) => {
    if (!date) return "Não definida";
    return new Date(date).toLocaleDateString('pt-BR');
  };

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

  function handleAddKeyResult(newKeyResult: KeyResult) {
    setObjective(prevObjectives => {
      return prevObjectives.map(obj => {
        if (obj.id === id) {
          return {
            ...obj,
            key_results: [...obj.key_results, newKeyResult]
          };
        }
        return obj;
      });
    });
    
    setOpenModal(false);
  }

  function handleEditKeyResult(keyResult: KeyResult) {
    setSelectedKeyResult(keyResult);
    setOpenEditModal(true);
  }

  function handleUpdateKeyResult(updatedKeyResult: KeyResult) {
    setObjective(prevObjectives => {
      return prevObjectives.map(obj => {
        if (obj.id === id) {
          return {
            ...obj,
            key_results: [...obj.key_results.map(kr => 
              kr.id === updatedKeyResult.id ? updatedKeyResult : kr
            )]
          };
        }
        return obj;
      });
    });
    
    setOpenEditModal(false);
    setSelectedKeyResult(null);
  }

  function handleUpdateObjective(updatedObjective: Objective) {
    setObjective(prevObjectives => {
      return prevObjectives.map(obj => obj.id === id ? updatedObjective : obj);
    });
    setOpenEditObjectiveModal(false);
  }

  const redirectToKanban = (keyResultId: string | number) => {
    router.push(`/okr/kanban/${keyResultId}`);
  };

  return (
    <div
      key={id}
      className="bg-gray-100 rounded-lg shadow-md w-[300px] h-[calc(100vh-210px)] p-4 flex flex-col flex-shrink-0"
    >
      <div className="flex justify-between items-center mb-5">
        <div className="text-lg font-semibold text-gray-700">
          {objective_name}
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setOpenEditObjectiveModal(true);
          }}
          className="text-gray-500 hover:text-gray-700"
        >
          Editar
        </button>
      </div>

      <p className="text-sm text-gray-500 h-24">
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

      <div className="mt-20">
        <p className="text-gray-600 font-medium mb-2">
          Resultados Chaves
        </p>
        <ul className="space-y-2 mb-2 max-h-[280px] overflow-y-auto">
          {key_results.map((result, index) => (
            <li
              key={result.id || index}
              className="bg-blue-100 text-blue-600 p-2 rounded-lg flex flex-col shadow-sm cursor-pointer"
              onClick={() => redirectToKanban(result.id)}
            >
              <div
               
              className="flex justify-between items-center">
                <span className="font-medium">{result.key_result_name}</span>
                <button onClick={(e) => {
                   e.stopPropagation();
                  handleEditKeyResult(result)}} className="text-gray-500 hover:text-gray-700">
                  ...
                </button>
              </div>

              <div className="flex justify-between items-center mt-1 text-xs">
                <span className="text-gray-600">Status:</span>
                <span className={`px-2 py-0.5 rounded-full ${getStatusColorClass(result.status)}`}>
                  {getStatusText(result.status)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={() => setOpenModal(true)}
        className="mt-2 w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-lg"
      >
        + Criar Resultados Chaves
      </button>
      {openModal && (
        <CreateKeyResultModal
          onClose={setOpenModal}
          open={openModal}
          addKeyResult={handleAddKeyResult}
          objectiveId={id}
        />
      )}
      {openEditModal && selectedKeyResult && (
        <EditKeyResultModal
          onClose={setOpenEditModal}
          open={openEditModal}
          editKeyResult={handleUpdateKeyResult}
          keyResult={selectedKeyResult}
        />
      )}
      {openEditObjectiveModal && (
        <EditObjectiveModal
          onClose={setOpenEditObjectiveModal}
          open={openEditObjectiveModal}
          objective={objective}
          updateObjective={handleUpdateObjective}
        />
      )}

    </div>
  );
}