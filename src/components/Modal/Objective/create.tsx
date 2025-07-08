import { useState } from 'react';
import Modal from '@/components/Modal';
import { useRouter } from 'next/router';

interface ModalProps {
  open: boolean;
  onClose: (value: boolean) => void;
  addObjective: () => void;
}

export default function ObjectiveModal(props: Readonly<ModalProps>) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('active');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { projectId } = router.query;

  const handleSave = async () => {
    if (!title.trim()) {
      alert('Por favor, insira um título para o objetivo');
      return;
    }

    if (!startDate) {
      alert('Por favor, selecione uma data de início');
      return;
    }

    if (!endDate) {
      alert('Por favor, selecione uma data de término');
      return;
    }

    // Validate that end date is after start date
    if (new Date(endDate) <= new Date(startDate)) {
      alert('A data de término deve ser posterior à data de início');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/objectives`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project_id: Number(projectId),
          objective_name: title,
          description: description,
          start_date: new Date(startDate),
          end_date: new Date(endDate),
          status: status
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erro ao criar objetivo: ${errorData.message || response.status}`);
      }
      // Call the addObjective function passed from the parent component
      props.addObjective();
      
      // Reset form and close modal
      setTitle('');
      setDescription('');
      setStartDate('');
      setEndDate('');
      setStatus('active');
      props.onClose(false);
    } catch (error) {
      console.error('Erro ao salvar objetivo:', error);
      alert('Ocorreu um erro ao salvar o objetivo. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Modal
        isOpen={props.open}
        onClose={() => props.onClose(false)}
        title="Objetivo"
        footer={
          <button
            onClick={handleSave}
            disabled={isSubmitting}
            className={`px-10 py-2 text-black bg-[#A7D994] rounded-full hover:bg-[#A7D994AA] ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Salvando...' : 'Criar'}
          </button>
        }
      >
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="title">
              Título
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border bg-[#D4D4D4] rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="description">
              Descrição
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border bg-[#D4D4D4] rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="startDate">
                Data de Início
              </label>
              <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 border bg-[#D4D4D4] rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="endDate">
                Data de Término
              </label>
              <input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2 border bg-[#D4D4D4] rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2 border bg-[#D4D4D4] rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            >
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
              <option value="completed">Concluído</option>
            </select>
          </div>
        </form>
      </Modal>
    </>
  );
}