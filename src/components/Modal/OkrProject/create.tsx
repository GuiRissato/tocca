
import React, { useState } from 'react';
import Modal from '../index';

interface ModalProps {
  open: boolean;
  onClose: (value: boolean) => void;
  addProjectOkr: (name: string, desc: string) => void;
}

export default function ProjectOKRCreateModal(props: Readonly<ModalProps>) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = () => {
    props.addProjectOkr(name, description);
    props.onClose(false);
  };

  return (
    <Modal
      isOpen={props.open}
      onClose={() => props.onClose(false)}
      title="Projeto OKR"
      footer={
        <button
          onClick={handleCreate}
          className="px-10 py-2 text-black bg-[#A7D994] rounded-full hover:bg-[#A7D994AA]"
        >
          Criar
        </button>
      }
    >
      <form>
        <div className="mb-4">
          <label
            className="block mb-2 text-sm font-medium text-gray-700"
            htmlFor="title"
          >
            Nome
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border bg-[#D4D4D4] rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        <div className="mb-4">
          <label
            className="block mb-2 text-sm font-medium text-gray-700"
            htmlFor="description"
          >
            Descrição
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border bg-[#D4D4D4] rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
      </form>
    </Modal>
  );
}
