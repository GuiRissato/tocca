import React, { useState } from 'react';
import Modal from '..';

interface ModalProps {
  open: boolean;
  onClose: (value: boolean) => void;
  taskId: number;
  taskData: string | undefined;
  refreshKanban : () => void;
}

export default function DelayedTaskModal (props: Readonly<ModalProps>) {
  const [delayReason, setDelayReason] = useState<string | undefined>(props.taskData);
 
  const handleSave = async () => {
    try {
      await fetch(`/api/tasks/delay/${props.taskId}`,{
        method: 'PATCH',
        headers:{
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({delayReason})
      })
      
      props.onClose(false);
      props.refreshKanban();
      
    } catch (error) {
      console.error('error updating task', error)
    }
  };
 
  return (
    <>
      <Modal
        isOpen={props.open}
        onClose={() => props.onClose(false)}
        title="Motivo do atraso"
        footer={
          <button
            onClick={handleSave}
            className="px-10 py-2 text-black bg-[#D9D894] rounded-full hover:bg-[#D9D894AA]"
          >
            Atualizar
          </button>
        }
      >
        <form>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="description">
              Descrição do atraso
            </label>
            <textarea
              id="description"
              className="w-full px-4 py-2 border bg-[#D4D4D4] rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              value={delayReason}
              onChange={(e) => setDelayReason(e.target.value)}
              placeholder="Descreva o motivo pelo qual esta tarefa está bloqueada..."
              rows={4}
            />
          </div>
        </form>
      </Modal>
    </>
  );
};