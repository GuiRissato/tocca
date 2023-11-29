import React, { useState } from 'react';
import './styles.css';
import CreateProjectModal from '../../components/CreateProjectModal';
import trash from '../../assets/images/trash.svg'
import { Link } from 'react-router-dom';

interface Project {
  id: number;
  name: string;
  description: string;
}

const CreateProjectButton: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleCreateProject = (newProject: Project) => {
    // Criar um ID único para o novo projeto (exemplo simples)
    newProject.id = Math.floor(Math.random() * 1000) + 1;

    // Atualizar o estado com o novo projeto
    setProjects([...projects, newProject]);

    // Fechar a modal
    setShowModal(false);
  };

  const handleDeleteProject = () =>{

  }

  return (
<div className="container">
      <h1>Tocca</h1>
      <div className="content">
        <div className='cards-container'>
          <div className="create-project-button" onClick={toggleModal}>
            <span className="plus-symbol">+</span>
            <p>Criar Projeto</p>
          </div>
            <div className='new-project'>
              {projects.map(project => (
                <Link style={{textDecoration:'none', color: 'inherit'}} key={project.id} to={`/projects/${project.id}/kanban`}>
                  <div className="project-card" key={project.id}>
                    <h3>{project.name}</h3>
                    <p>{project.description}</p>
                    <div style={{ display:'flex', justifyContent:'flex-end', width:'100%'}}>
                      <img src={trash} alt='deletar' onClick={()=>handleDeleteProject()} style={{cursor:'pointer'}}/>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
        </div>
        {showModal && <CreateProjectModal onClose={toggleModal} onCreateProject={handleCreateProject} />}
      </div>
    </div>
  );
};

export default CreateProjectButton;