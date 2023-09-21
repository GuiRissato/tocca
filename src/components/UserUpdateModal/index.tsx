// src/components/UserUpdateModal.tsx
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import api from '../../interface/API';

interface UserUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UpdateUserData;
}

interface UpdateUserData {
  id: number;
  user_name: string;
  name: string;
  age: number;
  password: string | undefined;
}

const UserUpdateModal: React.FC<UserUpdateModalProps> = ({ isOpen, onClose, user }) => {
  const [updatedUserData, setUpdatedUserData] = useState<UpdateUserData>({
    ...user,
    password: '',
});

useEffect(() => {
    setUpdatedUserData({ ...user, password: '' });
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedUserData({
      ...updatedUserData,
      [name]: value,
    });
  };

  const handleUpdateUser = async () => {
    try {
      // Envie dados atualizados, incluindo a senha, para a API para atualizar o usuário
      await api.put(`/userUpdate/${user.id}`, updatedUserData)
      // Feche o modal após a atualização bem-sucedida
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar o usuário', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <div className="modal-header">Atualização de Usuário</div>
      <form className="modal-form">
        <label htmlFor="user_name">Nome de Usuário:</label>
        <input
          type="text"
          id="user_name"
          name="user_name"
          value={updatedUserData.user_name}
          onChange={handleInputChange}
        />
        <label htmlFor="name">Nome:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={updatedUserData.name}
          onChange={handleInputChange}
        />
        <label htmlFor="age">Idade:</label>
        <input
          type="number"
          id="age"
          name="age"
          value={updatedUserData.age}
          onChange={handleInputChange}
        />
        {/* Adicione um campo de senha para atualizar a senha */}
        <label htmlFor="password">Nova Senha:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={updatedUserData.password}
          onChange={handleInputChange}
        />
        <button type="button" onClick={handleUpdateUser}>
          Atualizar
        </button>
      </form>
    </Modal>
  );
};

export default UserUpdateModal;
