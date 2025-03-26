import { useState, useEffect } from "react";
import { Objective } from "@/pages/okr/objective/[projectId]";
import Modal from "..";

interface ModalProps {
  open: boolean;
  onClose: (value: boolean) => void;
  objective: Objective;
  updateObjective: (updatedObjective: Objective) => void;
}

export default function EditObjectiveModal(props: Readonly<ModalProps>) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    objective_name: "",
    description: "",
    start_date: "",
    end_date: "",
    status: "active"
  });
  const [error, setError] = useState("");

  function formatDateForInput(date: Date | string | undefined): string {
    if (!date) return "";
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return dateObj.toISOString().split("T")[0];
  }

  useEffect(() => {
    if (props.objective) {
      setFormData({
        objective_name: props.objective.objective_name || "",
        description: props.objective.description || "",
        start_date: formatDateForInput(props.objective.start_date),
        end_date: formatDateForInput(props.objective.end_date),
        status: props.objective.status || "active"
      });
    }
  }, [props.objective]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.objective_name.trim()) {
      setError("O nome do objetivo é obrigatório");
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
      const response = await fetch(`/api/objectives/${props.objective.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          objective_name: formData.objective_name,
          description: formData.description,
          start_date: new Date(formData.start_date),
          end_date: new Date(formData.end_date),
          status: formData.status,
        }),
      });

      const data = await response.json();
      
      props.updateObjective(data);
      props.onClose(false);
    } catch (err) {
      console.error("Erro ao atualizar objetivo:", err);
      setError("Ocorreu um erro ao atualizar o objetivo. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={props.open}
      onClose={() => props.onClose(false)}
      title="Editar Objetivo"
      footer={
        <button
          onClick={handleSave}
          disabled={isLoading}
          className={`px-10 py-2 text-black ${isLoading ? 'bg-gray-400' : 'bg-[#D9D894] hover:bg-[#D9D894AA]'} rounded-full`}
        >
          {isLoading ? "Salvando..." : "Salvar"}
        </button>
      }
    >
      <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
        {error && (
          <div className="p-2 bg-red-100 text-red-700 rounded-lg">{error}</div>
        )}

        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="objective_name">
            Nome do Objetivo *
          </label>
          <input
            id="objective_name"
            type="text"
            value={formData.objective_name}
            onChange={handleChange}
            className="w-full px-4 py-2 border bg-gray-100 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Digite o nome do objetivo"
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
            className="w-full px-4 py-2 border bg-gray-100 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Digite a descrição do objetivo"
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
              className="w-full px-4 py-2 border bg-gray-100 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
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
              className="w-full px-4 py-2 border bg-gray-100 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
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
            className="w-full px-4 py-2 border bg-gray-100 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
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
  );
}