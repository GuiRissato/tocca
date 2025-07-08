
import { useState } from "react";
import Modal from "..";
import { KeyResult } from "@/pages/okr/objective/[projectId]";

interface ModalProps {
    open: boolean;
    onClose: (value: boolean) => void;
    addKeyResult: (value: KeyResult) => void;
    objectiveId: string | number;
}

export default function CreateKeyResultModal(props: Readonly<ModalProps>) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    key_result_name: "",
    description: "",
    start_date: formatDateForInput(new Date()),
    end_date: formatDateForInput(new Date(new Date().setMonth(new Date().getMonth() + 3))), // Default to 3 months from now
    status: "active"
  });
  const [error, setError] = useState("");

  // Helper function to format date for input field
  function formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.key_result_name.trim()) {
      setError("O título é obrigatório");
      return false;
    }

    if (!formData.start_date) {
      setError("A data de início é obrigatória");
      return false;
    }

    if (!formData.end_date) {
      setError("A data de término é obrigatória");
      return false;
    }

    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);

    if (endDate < startDate) {
      setError("A data de término deve ser posterior à data de início");
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/key-results`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          objective_id: props.objectiveId,
          key_result_name: formData.key_result_name,
          description: formData.description,
          start_date: new Date(formData.start_date),
          end_date: new Date(formData.end_date),
          status: formData.status,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Reset form and close modal
      setFormData({
        key_result_name: "",
        description: "",
        start_date: formatDateForInput(new Date()),
        end_date: formatDateForInput(new Date(new Date().setMonth(new Date().getMonth() + 3))),
        status: "active"
      });
      
      props.addKeyResult(data);
      props.onClose(false);
    } catch (err) {
      console.error('Erro ao criar resultado chave:', err);
      setError("Ocorreu um erro ao criar o resultado chave. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Modal
        isOpen={props.open}
        onClose={() => props.onClose(false)}
        title="Resultado Chave"
        footer={
          <button
            onClick={handleSave}
            disabled={isLoading}
            className={`px-10 py-2 text-black ${isLoading ? 'bg-gray-400' : 'bg-[#A7D994] hover:bg-[#A7D994AA]'} rounded-full`}
          >
            {isLoading ? "Criando..." : "Criar"}
          </button>
        }
      >
        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          {error && (
            <div className="p-2 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="key_result_name">
              Título *
            </label>
            <input
              id="key_result_name"
              type="text"
              value={formData.key_result_name}
              onChange={handleChange}
              className="w-full px-4 py-2 border bg-[#D4D4D4] rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Digite o título do resultado chave"
            />
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="description">
              Descrição
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border bg-[#D4D4D4] rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Descreva o resultado chave"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="start_date">
                Data de Início *
              </label>
              <input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={handleChange}
                className="w-full px-4 py-2 border bg-[#D4D4D4] rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="end_date">
                Data de Término *
              </label>
              <input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={handleChange}
                className="w-full px-4 py-2 border bg-[#D4D4D4] rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border bg-[#D4D4D4] rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option value="active">Ativo</option>
              <option value="pending">Pendente</option>
              <option value="completed">Concluído</option>
            </select>
          </div>
          
          <div className="text-xs text-gray-500">
            * Campos obrigatórios
          </div>
        </form>
      </Modal>
    </>
  );
}
