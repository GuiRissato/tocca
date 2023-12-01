import React, { useEffect, useState } from 'react';
import { useDrop } from 'react-dnd';

import { Card, CardProps } from '../Card';
import AddCardModal from '../CardCreateModal';
import './styles.css';

import api from '../../interface/API';
import { Project } from '../../pages/Main';
import { BoardData } from '../../pages/Kanban';

interface BoardProps {
  project: Project;
  boardData: BoardData | any;
}

interface GroupedCards {
  [status: string]: Array<CardProps>;
}

export const Board: React.FC<BoardProps> = ({ project, boardData }) => {
  const initialBoard: GroupedCards = boardData.columns.reduce((acc: { [x: string]: never[]; }, column: { name: string | number; }) => {
    acc[column.name] = [];
    return acc;
  }, {} as GroupedCards);

  const [groupedCards, setGroupedCards] = useState<GroupedCards>(initialBoard);

  const [, drop] = useDrop(() => ({
    accept: 'card',
    hover(item: CardProps, monitor) {
      const { id, status: draggedStatus } = item;
      const hoverIndex = monitor.getClientOffset();

      if (hoverIndex) {
        const hoveredColumn = document.elementFromPoint(hoverIndex.x, hoverIndex.y);

        if (hoveredColumn) {
          const hoverColumnId = Number(hoveredColumn.getAttribute('data-id'));

          if (Number(draggedStatus) !== hoverColumnId) {
            const updatedCards = { ...groupedCards };
            const draggedCardIndex =
              updatedCards[draggedStatus].findIndex((card: any) => card.id === id) ||
              updatedCards[draggedStatus].findIndex((card: any) => card.id === +id);

            if (draggedCardIndex !== -1) {
              const draggedCard: any = updatedCards[draggedStatus][draggedCardIndex];
              draggedCard.column_id = hoverColumnId;

              updatedCards[draggedStatus] = updatedCards[draggedStatus].filter((card: any) => card.id !== id && card.id !== +id);

              if (!updatedCards[hoverColumnId]) {
                updatedCards[hoverColumnId] = [];
              }

              updatedCards[hoverColumnId].push({ ...draggedCard, status: hoverColumnId });

              setGroupedCards({ ...updatedCards });
            }
          }
        }
      }
    },
  }));

  

  async function getCardsByColumn(columnId: number) {
    try {
      const response = await api.get(`/boards/${boardData.board.id}/columns/${columnId}/cards`);
      const columnCards = response.data;
  
      setGroupedCards((prevGroupedCards) => ({
        ...prevGroupedCards,
        [columnId]: columnCards,
      }));
    } catch (error) {
      console.error('Erro ao buscar cards da coluna:', error);
    }
  }

  useEffect(() => {
    // Para cada coluna na board, chame a função getCardsByColumn para buscar os cards dessa coluna
    boardData.columns.forEach((column: any) => {
      getCardsByColumn(column.id);
    });
  }, [boardData, project.id]);

  const handleCardAdded = (newCard: any, columnId: number) => {
    // Adicione o novo card à coluna correta
    setGroupedCards((prevGroupedCards) => {
      const updatedCards = { ...prevGroupedCards };
  
      // Verifica se a coluna existe, senão cria um array vazio
      updatedCards[columnId] = updatedCards[columnId] || [];
  
      // Adiciona o novo card à coluna correta
      updatedCards[columnId].push(newCard);
  
      return updatedCards;
    });
  };

  return (
    <div className='container-kanban' ref={drop}>
      <h2>{boardData.board.name}</h2>
      {boardData ? 
        <div className="board">
          {boardData.columns.map((column: any, index: number) => (
            <div className="column" data-status={column.name} data-id={column.id} key={index}>
              <h3>{column.name}</h3>
              {index === 0 && ( 
              <AddCardModal columnId={column.id} onCardAdded={(newCard) => handleCardAdded(newCard, column.id)} />
            )}
              
              {groupedCards[column.id] && (
              <div>
                {groupedCards[column.id].map((card: any, index:number) => (
                  <Card
                    column_id={card.column_id}
                    key={card.id}
                    id={card.id}
                    content={card.description} 
                    status={card.column_id} 
                    title={card.title} index={index}/>
                ))}
              </div>
            )}
            </div>
          ))}
        </div>
        : <></>}
      
    </div>
  );
};