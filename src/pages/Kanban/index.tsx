// KanbanPage.tsx
import React, { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Board } from '../../components/Board';
import './styles.css';
import { useLocation } from 'react-router-dom';
import api from '../../interface/API';

interface Column {
  id: number;
  board_id: number;
  name: string;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface BoardData {
  id: number;
  project_id: number;
  name: string;
  columns: Column[];
  createdAt: string;
  updatedAt: string;
}

const KanbanPage: React.FC = () => {
  const location = useLocation();
  const project = location.state?.project;
  const [boardData, setBoardData] = useState<BoardData | any>(null);

  useEffect(() => {
    if (project) {
      // Função assíncrona para buscar os dados do board e colunas do projeto
      const fetchBoardData = async () => {
        try {
          
          const response = await api.get(`/projects/${project.id}/board`);
          const { board, columns } = response.data;

          setBoardData({ board, columns });
        } catch (error) {
          console.error('Erro ao recuperar dados do board:', error);
        }
      };

      fetchBoardData(); // Chama a função para buscar os dados
    }
  }, [project]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container">
      {boardData && <Board project={project} boardData={boardData} />}
      </div>
    </DndProvider>
  );
};

export default KanbanPage;
