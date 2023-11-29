import React, { useEffect, useState } from 'react';
import { useDrop } from 'react-dnd';

import { Card, CardProps } from '../Card';
import './styles.css';

interface BoardProps {
  cards: Array<CardProps>;
}

interface GroupedCards {
  [status: string]: Array<CardProps>;
}

export const Board: React.FC<BoardProps> = ({ cards }) => {
  const initialBoard: GroupedCards = {
    todo: [],
    inprogress: [],
    done: [],
  };

  const [groupedCards, setGroupedCards] = useState<GroupedCards>(() => {
    return cards.reduce((acc, card) => {
      if (!acc[card.status]) {
        acc[card.status] = []; 
      }
      acc[card.status].push(card);
      return acc;
    }, { ...initialBoard });
  });

  useEffect(()=>{
    console.log('grouped',groupedCards)
  },[groupedCards])

  const [, drop] = useDrop(() => ({
    accept: 'card',
    hover(item: { id: number; status: string }, monitor) {
      const { id, status: draggedStatus } = item;
      const hoverIndex = monitor.getClientOffset(); // Posição do mouse no momento do hover

      if (hoverIndex) {
        const hoveredColumn = document.elementFromPoint(hoverIndex.x, hoverIndex.y);

        if (hoveredColumn) {
          const hoverStatus = hoveredColumn.getAttribute('data-status');

          if (hoverStatus !== null && draggedStatus !== hoverStatus) {
            const updatedCards = { ...groupedCards };
            const draggedCardIndex = updatedCards[draggedStatus].findIndex((card) => card.id === id);
            const draggedCard = updatedCards[draggedStatus][draggedCardIndex];

            if (draggedCard) {
              updatedCards[draggedStatus].splice(draggedCardIndex, 1);
              updatedCards[hoverStatus] = updatedCards[hoverStatus] || [];
              updatedCards[hoverStatus].push({ ...draggedCard, status: hoverStatus });
              setGroupedCards({ ...updatedCards });
            }
          }
        }
      }
    },
  }));

  return (
      <div className="board" ref={drop}>
        <div className="column" data-status="todo">
          <h2>Todo</h2>
          {groupedCards.todo.map((card, index) => (
            <Card key={card.id} id={card.id} content={card.content} status="todo" index={index}/>
          ))}
        </div>
        <div className="column" data-status="inprogress">
          <h2>In Progress</h2>
          {groupedCards.inprogress.map((card, index) => (
            <Card key={card.id} id={card.id} content={card.content} status="inprogress" index={index} />
          ))}
        </div>
        <div className="column" data-status="done">
          <h2>Done</h2>
          {groupedCards.done.map((card, index) => (
            <Card key={card.id} id={card.id} content={card.content} status="done" index={index} />
          ))}
        </div>
      </div>
  );
};