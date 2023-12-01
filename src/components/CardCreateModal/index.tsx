import React, { useState } from 'react';
import api from '../../interface/API'; 
import './styles.css'

interface AddCardModalProps {
  columnId: number; // Suponho que você tenha o ID da coluna para associar ao novo card
  onCardAdded: (newCard: any) => void; // Função para atualizar o estado dos cards após a adição
}

const AddCardModal: React.FC<AddCardModalProps> = ({ columnId, onCardAdded }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    // Limpa os campos ao fechar o modal
    setTitle('');
    setDescription('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newCardData = {
      column_id: columnId,
      title,
      description,
    };

    try {
      const response = await api.post('/cards', newCardData); // Rota e método da API para adicionar um card

      onCardAdded(response.data); // Atualize o estado após a adição do card
      handleCloseModal(); // Feche o modal após adicionar o card
    } catch (error) {
      console.error('Erro ao adicionar o card:', error);
      // Trate o erro ou forneça feedback ao usuário, se necessário
    }
  };

  return (
    <div>
      <button onClick={handleOpenModal}>Adicionar Card</button>
      {isOpen && (
        <div className="overlay show">
          <div className="modal show">
            <span className="close-button" onClick={handleCloseModal}>
              &times;
            </span>
            <h2>Adicionar Card</h2>
            <form className="form-container" onSubmit={handleSubmit}>
                <input
                  className="input-field"
                  type="text"
                  placeholder="Título do Card"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
                <textarea
                  className="textarea-field"
                  placeholder="Descrição do Card"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>
                <button type="submit" className="create-button">
                  Adicionar
                </button>
              </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddCardModal;
