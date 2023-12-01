// src/components/UserRegistrationModal.tsx
import React, { useState } from 'react';
import Modal from 'react-modal';
import './styles.css';
import api from '../../interface/API';

interface UserRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserRegistrationModal: React.FC<UserRegistrationModalProps> = ({ isOpen, onClose }) => {
  const [userData, setUserData] = useState({
    user_name: '',
    password: '',
    name: '',
    email: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleRegister = async () => {
    try {
      // Faça a solicitação para registrar o usuário na sua API aqui
     const response = await api.post('/users',userData)

      if (response.status === 201) {
        // Registro bem-sucedido, pode tratar de acordo com sua necessidade
        console.log('Usuário registrado com sucesso');

        // Feche o modal após o registro bem-sucedido
        onClose();
      } else {
        // Lidar com erros de registro, por exemplo, exibir uma mensagem de erro
        console.error('Erro ao registrar o usuário');
      }
    } catch (error) {
      // Lidar com erros de conexão com a API
      console.error('Erro ao registrar o usuário', error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <div className="modal-header">Cadastro de Usuário</div>
      <form className="modal-form">
        <label htmlFor="user_name">Nome de Usuário:</label>
        <input type="text" id="user_name" name="user_name" value={userData.user_name} onChange={handleInputChange} />

        <label htmlFor="password">Senha:</label>
        <input type="password" id="password" name="password" value={userData.password} onChange={handleInputChange} />

        <label htmlFor="name">Nome:</label>
        <input type="text" id="name" name="name" value={userData.name} onChange={handleInputChange} />

        <label htmlFor="age">email:</label>
        <input type="text" id="email" name="email" value={userData.email} onChange={handleInputChange} />

        <button type="button" onClick={handleRegister}>
          Cadastrar
        </button>
      </form>
    </Modal>
  );
};

export default UserRegistrationModal;
