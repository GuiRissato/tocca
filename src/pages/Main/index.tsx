import React, { useState, useEffect } from 'react';
import './styles.css'
import CreateProjectModal from '../../components/CreateProjectModal';
import trash from '../../assets/images/trash.svg'
import { Link, Navigate } from 'react-router-dom';
import api from '../../interface/API';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

export interface Project {
  id: number;
  name: string;
  description: string;
}

const CreateProjectButton: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const userId: string | undefined = Cookies.get('user-cookie');
  const navigate = useNavigate();

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  async function getProjectsByUser(){
   await api.get(`/users/${userId}/projects`)
        .then((response) => {
          let projects: any = []
          response.data.map((item:any)=>{
            projects.push({id:item.project.id,name:item.project.name, description: item.project.description})
          })
          setProjects(projects)
        })
        .catch((error) => {
          console.error('Erro ao buscar projetos do usuário:', error);
        });
  }

  useEffect(() => {
    if (userId) {
      getProjectsByUser()
    }
  }, [userId]);

  const handleCreateProject = async (newProject: Project) => {    

    await api.post('/projects', newProject).then( async (res:any)=>{
      console.log('res',res.data.project)
      setProjects([...projects, res.data.project])
      if(res.status == 201){        
        await api.post('/user-projects',{user_id:userId, project_id: res.data.project.id})        
      }
    })

    setShowModal(false);
  };

  const handleDeleteProject = async (id:number) =>{
  await api.delete('/projects/' + id).then((res:any)=>{
      getProjectsByUser()
  })
}

const handleProjectCardClick = async (project: Project) => {
  try {
    // Criar a nova board associada ao projeto
    const response = await api.post('/boards', { project_id: project.id, name:"Kanban " + project.name  });

    if (response.status === 201 || response.status === 400) {
      // Redirecionar para a tela de Kanban
      navigate(`/projects/${project.id}/kanban`, { state: { project } });
    }
  } catch (error) {
    console.error('Erro ao criar board:', error);
  }
};

  return (
<div className="container-project">
      <div>
        <h1>Tocca</h1>
      </div>
      <div className="content">
        <div className='cards-container'>
          <div className="create-project-button" onClick={()=>toggleModal}>
            <span className="plus-symbol">+</span>
            <p>Criar Projeto</p>
          </div>
            <div className='new-project'>
              {projects.map(project => {
                return(
                <div className="project-card">
                  <Link style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer', width: '100%' }} key={project.id} onClick={() => handleProjectCardClick(project)} to={''} >
                    <div style={{display:'flex', flexDirection:'column', alignItems:'center'}} key={project.id}>
                      <h3>{project.name}</h3>
                      <p>{project.description}</p>
                    </div>
                  </Link>
                  <div style={{display:'flex',width:'100%', justifyContent:'flex-end'}}>
                    <img src={trash} alt='deletar' onClick={()=>handleDeleteProject(project.id)} style={{cursor:'pointer'}}/>
                  </div>

                </div>
              )})}
            </div>
        </div>
        {showModal && <CreateProjectModal onClose={toggleModal} onCreateProject={handleCreateProject} />}
      </div>
    </div>
  );
};

export default CreateProjectButton;