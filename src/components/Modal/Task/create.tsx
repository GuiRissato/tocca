import React from 'react';
import Modal from '../index';



interface ModalProps {
    open: boolean;
    onClose: (value: boolean) => void;
    // addKeyResult: (value: KeyResult ) => void;
}
export default function CreateTaskModal (props: Readonly<ModalProps>) {

  const handleSave = () => {

    console.log('Task salvo!');
    props.onClose(false)
  };

  return (
    <>
      <Modal
        isOpen={props.open}
        onClose={() => props.onClose(false)}
        title="Tarefa"
        footer={
          <button
            onClick={handleSave}
            className="px-10 py-2 text-black bg-[#A7D994] rounded-full hover:bg-[#A7D994AA]"
          >
            Criar
          </button>
        }
      >
        <form>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="title">
              Título
            </label>
            <input
              id="title"
              type="text"
              className="w-full px-4 py-2 border bg-[#D4D4D4] rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="description">
              Descrição
            </label>
            <textarea
              id="description"
              className="w-full px-4 py-2 border bg-[#D4D4D4] rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="estimatedTime">
                Tempo estimado
              </label>
              <input
                id="estimatedTime"
                type="text"
                className="w-full px-4 py-2 border bg-[#D4D4D4] rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="priority">
                Prioridade
              </label>
              <input
                id="priority"
                type="text"
                className="w-full px-4 py-2 border bg-[#D4D4D4] rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="tag">
                Tag
              </label>
              <input
                id="tag"
                type="text"
                className="w-full px-4 py-2 border bg-[#D4D4D4] rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="responsibles">
                Responsáveis
              </label>
              <input
                id="responsibles"
                type="text"
                className="w-full px-4 py-2 border bg-[#D4D4D4] rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              />
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
};

