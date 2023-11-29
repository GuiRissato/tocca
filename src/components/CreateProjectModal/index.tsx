import React, { useState } from 'react';
import './styles.css'; // Arquivo de estilos

interface Project {
  id: number;
  name: string;
  description: string;
}

interface CreateProjectModalProps {
  onClose: () => void;
  onCreateProject: (newProject: Project) => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ onClose, onCreateProject }) => {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');

  const handleProjectNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProjectName(e.target.value);
  };

  const handleProjectDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setProjectDescription(e.target.value);
  };

  const handleCreateProject = () => {
    if (projectName && projectDescription) {
      onCreateProject({id:Math.random(), name: projectName, description: projectDescription });
      onClose(); // Fechar a modal após criar o projeto
    }
  };

  return (
    <div className="modal">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="header">
          <div className="title">
            Criar Novo Projeto
          </div>
          <div className='exit'>
            <span className="close" onClick={onClose}>×</span>
          </div>
        </div>
        <input
          type="text"
          placeholder="Nome do Projeto"
          value={projectName}
          onChange={handleProjectNameChange}
          className="input-field"
        />
        <textarea
          placeholder="Descrição do Projeto"
          value={projectDescription}
          onChange={handleProjectDescriptionChange}
          rows={4}
          className="textarea-field"
        />
        <button onClick={handleCreateProject} className="create-button">Criar</button>
      </div>
    </div>
  );
};

export default CreateProjectModal;
