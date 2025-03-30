import React, { useState } from 'react';
import { Pencil } from 'lucide-react'; // Import the pencil icon or use any other icon library
import { TaskTag, TaskUser } from '@/components/Modal/Task/edit';

interface Task {
  id: string;
  title: string;
  description: string;
  order: number;
  hours?: string;
  priority?: string;
  comments?: string[];
  tags?: string[] | TaskTag[];
  users?: string[] | TaskUser[];
  dueDate?: string;
  delayReason?: string;
  column_key_result_id: number;
}

interface TaskCardProps {
  task: Task;
  onDragStart: (task: Task, sourceColumn: string) => void;
  columnId: string;
  handleCardDragOver: (event: React.DragEvent<HTMLDivElement>, taskId: string) => void;
  onReportDelayed: (taskId: number) => void;
  handleEditTask: (taskId: number, columnId: string) => void; // New prop for edit functionality
}

export default function TaskCard({ 
  task, 
  onDragStart, 
  columnId, 
  handleCardDragOver, 
  onReportDelayed,
  handleEditTask 
}: Readonly<TaskCardProps>) {
  // State to track if the card is expanded
  const [isExpanded, setIsExpanded] = useState(false);

  // Function to format date to a more readable format
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  // Toggle expanded state
  const toggleExpand = (e: React.MouseEvent) => {
    // Prevent this from triggering drag events
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  // Handle drag start without affecting the expand/collapse functionality
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onDragStart(task, columnId);
  };

  // Handle edit button click
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card expansion
    handleEditTask(Number(task.id), columnId);
  };

  return (
    <div
      key={task.id}
      className={`bg-[#C2C2C2] mb-4 rounded-lg p-3 shadow-sm relative transition-all duration-200 ${isExpanded ? 'shadow-md' : ''}`}
      draggable
      onDragStart={handleDragStart}
      onDragOver={(e) => handleCardDragOver(e, task.id)}
      onClick={toggleExpand}
      style={{ cursor: 'pointer' }}
    >
      {/* Always visible content */}
      <div className="flex justify-between items-start">
        <h3 className="text-md font-medium text-gray-800 mb-2 flex-grow">
          {task.title}
        </h3>
        <div className="flex items-center space-x-2">
          {/* Edit button */}
          <button 
            onClick={handleEditClick}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            title="Editar tarefa"
          >
            <Pencil size={16} />
          </button>
          
          {/* Expand/collapse icon */}
          <div className="text-gray-500">
            {isExpanded ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* Always visible - Users */}
      {task.users && task.users.length > 0 && (
        <div className="mb-2">
          <div className="flex flex-wrap gap-1">
            {task.users.map((user, index) => (
              <span 
                key={index} 
                className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
              >
                {String(user)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Always visible - Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="mb-2">
          <div className="flex flex-wrap gap-1">
            {task.tags.map((tag, index) => (
              <span 
                key={index} 
                className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full"
              >
                {String(tag)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Expandable content */}
      {isExpanded && (
        <div className="mt-3 expanded-content">
          <div className="border-b border-gray-300 my-2"></div>
          
          {/* Description */}
          <p className="text-sm text-gray-600 mb-3">
            {task.description}
          </p>
          
          <div className="border-b border-gray-300 my-2"></div>
          
          {/* Due Date */}
          {task.dueDate && (
            <div className="flex items-center text-xs text-gray-700 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-medium">Data prevista de término:</span>
              <span className="ml-1">{formatDate(task.dueDate)}</span>
            </div>
          )}
          
          <div className="border-b border-gray-300 my-2"></div>
          
          {/* Priority */}
          {task.priority && (
            <div className="flex items-center text-xs text-gray-700 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
              <span className="font-medium">Prioridade:</span>
              <span className="ml-1">
                {task.priority === '1' ? 'Baixa' : 
                 task.priority === '2' ? 'Média' : 
                 task.priority === '3' ? 'Alta' : task.priority}
              </span>
            </div>
          )}
          
          <div className="border-b border-gray-300 my-2"></div>
          
          {/* Action Buttons */}
          <div className="mt-3 flex justify-end">
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent card expansion toggle
                onReportDelayed(Number(task.id));
              }}
              className="bg-red-100 hover:bg-red-200 text-red-700 text-xs px-2 py-1 rounded"
            >
              Reportar Atraso
            </button>
          </div>
        </div>
      )}
    </div>
  );
}