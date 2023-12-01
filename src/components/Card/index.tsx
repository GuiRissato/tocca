// Card.tsx
import React from 'react';
import { useDrag } from 'react-dnd';
import './styles.css'

export interface CardProps {
  column_id: string | null;
  id: number;
  title:string;
  content: string;
  index: number;
  status: string; 
}

export const Card: React.FC<CardProps> = ({ id, content,title, index, status }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'card',
    item: { id, index, title, content, status },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  console.log('Card dragged:', id, title, status);

  return (
    <div ref={drag} className='card-container '>
      <div>
        {title}
      </div>
      <div>
        Descrição:
        {content}
      </div>
    </div>
  );
};
