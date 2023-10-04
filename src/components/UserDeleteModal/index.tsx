// UserDeleteConfirmationModal.tsx
import React from 'react';
import Modal from 'react-modal';

interface UserDeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  user: UserData;
}

interface UserData {
  id: number;
  user_name: string;
  name: string;
  age: number;
}

const UserDeleteConfirmationModal: React.FC<UserDeleteConfirmationModalProps> = ({
  isOpen,
  onClose,
  onDelete,
  user,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <div className="modal-header">Confirmação de Exclusão</div>
      <div>
        <p>Você tem certeza de que deseja excluir o usuário:</p>
        <p><strong>Nome de Usuário:</strong> {user.user_name}</p>
        <p><strong>Nome:</strong> {user.name}</p>
        <p><strong>Idade:</strong> {user.age}</p>
      </div>
      <div>
        <button onClick={onDelete}>Confirmar Exclusão</button>
        <button onClick={onClose}>Cancelar</button>
      </div>
    </Modal>
  );
};

export default UserDeleteConfirmationModal;
