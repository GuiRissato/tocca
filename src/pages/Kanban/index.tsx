// KanbanPage.tsx
import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Board } from '../../components/Board';
import './styles.css';
import { CardProps } from '../../components/Card/index';

const cardData: Array<CardProps > = [
  { id: 1, content: 'Task 1', index:11, status: 'todo' },
  { id: 2, content: 'Task 2', index:22, status: 'inprogress' },
  { id: 3, content: 'Task 3', index:33, status: 'done' },
  { id: 4, content: 'Task 4', index:23, status: 'inprogress' },
];

const KanbanPage: React.FC = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="container">
        <Board cards={cardData} />
      </div>
    </DndProvider>
  );
};

export default KanbanPage;
