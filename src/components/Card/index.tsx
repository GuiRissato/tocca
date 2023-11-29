// Card.tsx
import React from 'react';
import { useDrag } from 'react-dnd';
import './styles.css'

export interface CardProps {
  id: number;
  content: string;
  index: number;
  status: string; 
}

export const Card: React.FC<CardProps> = ({ id, content, index, status }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'card',
    item: { id, index, status },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div ref={drag} className='card'>
      {content}
    </div>
  );
};
