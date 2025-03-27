import React from 'react';
interface Task {
  id: string;
  title: string;
  description: string;
  order: number;
  hours?: string;
  priority?: string;
  comments?: string[];
  tags?: string[];
  users?: string[];
  dueDate?: string;
  delayReason?: string;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

interface OkrColumnsProps {
    column: Column;  
    onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
    onDrop: (event: React.DragEvent<HTMLDivElement>, columnId: string) => void;
    handleCardDragOver: (event: React.DragEvent<HTMLDivElement>, taskId: string) => void;
    handleAddTask: (columnId: string) => void;
    onDragStart: (task: Task, sourceColumn: string) => void;
    onReportBlocked: (taskId: string) => void;
}

export default function OkrColumns(props: Readonly<OkrColumnsProps>) {
    // Function to format date to a more readable format
    const formatDate = (dateString?: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    return(
        <div
            key={props.column.id}
            className="bg-[#E4E3E3] w-[300px] min-w-[300px] h-[75vh] rounded-lg p-4 shadow-md flex flex-col justify-start flex-shrink-0"
            onDragOver={props.onDragOver}
            onDrop={(e) => props.onDrop(e, props.column.id)}
        >
            {/* Título da Coluna */}
            <div className="text-lg font-semibold text-gray-700 mb-4">
            {props.column.title}
            </div>

            {/* Tarefas */}
            <div className="overflow-y-auto">
            {props.column.tasks
                .toSorted((a, b) => (a.order || 0) - (b.order || 0))
                .map((task) => (
                    <div
                    key={task.id}
                    className="bg-[#C2C2C2] mb-4 rounded-lg p-3 shadow-sm relative"
                    draggable
                    onDragStart={() => props.onDragStart(task, props.column.id)}
                    onDragOver={(e) => props.handleCardDragOver(e, task.id)}
                >
                    <h3 className="text-md font-medium text-gray-800 mb-2">
                        {task.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                        {task.description}
                    </p>
                    
                    {/* Due Date with improved label */}
                    {task.dueDate && (
                        <div className="flex items-center text-xs text-gray-700 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="font-medium">Data prevista de término:</span>
                            <span className="ml-1">{formatDate(task.dueDate)}</span>
                        </div>
                    )}
                    
                    {/* Priority */}
                    {task.priority && (
                        <div className="flex items-center text-xs text-gray-700 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                            <span className="font-medium">Prioridade:</span>
                            <span className="ml-1">{task.priority}</span>
                        </div>
                    )}
                    
                    {/* Tags with improved label */}
                    {task.tags && task.tags.length > 0 && (
                        <div className="mb-2">
                            <div className="text-xs font-medium text-gray-700 mb-1">Tags:</div>
                            <div className="flex flex-wrap gap-1">
                                {task.tags.map((tag, index) => (
                                    <span 
                                        key={index} 
                                        className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* Assignees with improved label */}
                    {task.users && task.users.length > 0 && (
                        <div className="mb-2">
                            <div className="text-xs font-medium text-gray-700 mb-1">Responsável(eis):</div>
                            <div className="flex flex-wrap gap-1">
                                {task.users.map((user, index) => (
                                    <span 
                                        key={index} 
                                        className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
                                    >
                                        {user}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* Report Blocked Button */}
                    <div className="mt-3 flex justify-end">
                        <button
                            onClick={() => props.onReportBlocked(task.id)}
                            className="bg-red-100 hover:bg-red-200 text-red-700 text-xs px-2 py-1 rounded"
                        >
                            Reportar Bloqueio
                        </button>
                    </div>
                </div>
                ))}
            </div>

            {/* Botão Criar Tarefa */}
            <button
            onClick={() => props.handleAddTask(props.column.id)}
            className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-lg mt-auto"
            >
            + Criar Tarefa
            </button>
        </div>
    )
}