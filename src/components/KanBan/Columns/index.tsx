import React from 'react';
import TaskCard from '../Cards';
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
    onReportDelayed: (taskId: string) => void;
}

export default function OkrColumns(props: Readonly<OkrColumnsProps>) {
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
                        <TaskCard
                            key={task.id}
                            task={task}
                            onDragStart={props.onDragStart}
                            columnId={props.column.id}
                            handleCardDragOver={props.handleCardDragOver}
                            onReportDelayed={props.onReportDelayed}
                        />
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