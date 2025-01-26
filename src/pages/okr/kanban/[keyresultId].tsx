import { useState } from "react";
import HeaderLayout from "@/components/HeaderLayout";
import "../../../app/globals.css";
import OkrColumns from "@/components/KanBan/Columns";

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
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

interface KanbanData {
  columns: Column[];
}

export default function Kanban() {
  
  const [kanbanData, setKanbanData] = useState<KanbanData>({
    columns : [

      {
        id: "column-1",
        title: "Para Fazer",
        tasks: [
          {
              id: "task-1",
              title: "Tarefa 1",
              description: "Descrição 1",
              hours: "3 hours",
              priority: "Priority 1",
              order: 1
          },
        ],
      },
      {
        id: "column-2",
        title: "Pendente",
        tasks: [],
      },
      {
        id: "column-3",
        title: "Em Progresso",
        tasks: [],
      },
      {
        id: "column-4",
        title: "Finalizado",
        tasks: [],
      },
      {
        id: "column-5",
        title: "Fechado",
        tasks: [],
      }
    ]
  });
  const [draggedTask, setDraggedTask] = useState<{
    task: Task;
    sourceColumnId: string;
  } | null>(null);
  
  const [hoveredTaskId, setHoveredTaskId] = useState<string | null>(null);
  const [insertPosition, setInsertPosition] = useState<"above" | "below" | null>(null);

  const onDragStart = (task: Task, columnId: string) => {
    setDraggedTask({ task, sourceColumnId: columnId });
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleAddTask = (columnId: string) => {
    setKanbanData((prev) => {
      // 1) Achar a coluna
      const colIndex = prev.columns.findIndex((c) => c.id === columnId);
      if (colIndex === -1) return prev;
  
      const column = prev.columns[colIndex];
      const currentTasks = column.tasks;
  
      // 2) Definir a ordem como o próximo maior número
      const maxOrder =
        currentTasks.length > 0
          ? Math.max(...currentTasks.map((task) => task.order || 0))
          : 0;
  
      // 3) Criar o objeto newTask
      const newTaskId = `task-${Math.random().toString(36).substring(2, 10)}`;
      const newTask: Task = {
        id: newTaskId,
        title: `Nova Tarefa`,
        description: `Descrição da nova tarefa`,
        order: maxOrder + 1, // Próximo valor na ordem
      };
  
      // 4) Inserir na coluna
      const newColumns = [...prev.columns];
      newColumns[colIndex] = {
        ...column,
        tasks: [...column.tasks, newTask],
      };
  
      return {
        ...prev,
        columns: newColumns,
      };
    });
  };
  
  
  const onDrop = (e: React.DragEvent<HTMLDivElement>, targetColumnId: string) => {
    e.preventDefault();
    if (!draggedTask) return;
  
    const { task, sourceColumnId } = draggedTask;
  
    // 1) Se for a mesma coluna, é reorder
    if (sourceColumnId === targetColumnId) {
      reorderInSameColumn(sourceColumnId, task.id, hoveredTaskId);
    } 
    // 2) Caso contrário, é movimento para outra coluna
    else {
      moveToAnotherColumn(sourceColumnId, targetColumnId, task.id, hoveredTaskId);
    }
  
    setDraggedTask(null);
    setHoveredTaskId(null);
    setInsertPosition(null);
  };
  

  function reorderInSameColumn(
    columnId: string,
    draggedTaskId: string,
    hoveredId: string | null
  ) {
    setKanbanData((prev) => {
      // 1) Achar índice da coluna
      const columnIndex = prev.columns.findIndex((c) => c.id === columnId);
      if (columnIndex === -1) return prev; // Coluna não encontrada, retorna estado antigo
  
      // 2) Pegar a coluna em si
      const column = prev.columns[columnIndex];
  
      // 3) Remover a tarefa arrastada do array
      let newTasks = column.tasks.filter((t) => t.id !== draggedTaskId);
      // 4) Descobrir a posição onde inserir
      const draggedItem = column.tasks.find((t) => t.id === draggedTaskId);
  
      if (draggedItem) {
        if (hoveredId) {
          const hoverIndex = newTasks.findIndex((t) => t.id === hoveredId);
          if (hoverIndex >= 0) {
            if (insertPosition === "below") {
              newTasks.splice(hoverIndex + 1, 0, draggedItem);
            } else {
              newTasks.splice(hoverIndex, 0, draggedItem);
            }
          } else {
            // hoveredId não encontrada, adiciona no final
            newTasks.push(draggedItem);
          }
        } else {
          // Se não há hoveredId, joga no final
          newTasks.push(draggedItem);
        }
      }
  
      // 5) Reordenar a propriedade "order"
      newTasks = newTasks.map((task, index) => ({
        ...task,
        order: index + 1,
      }));
  
      // 6) Reconstruir as colunas
      const newColumns = [...prev.columns];
      newColumns[columnIndex] = {
        ...column,
        tasks: newTasks,
      };
  
      return {
        ...prev,
        columns: newColumns,
      };
    });
  }
  
  
  function moveToAnotherColumn(
    sourceColumnId: string, 
    targetColumnId: string, 
    draggedTaskId: string, 
    hoveredId: string | null
  ) {
    setKanbanData((prev) => {
      // 1) Achar as colunas de origem e destino
      const sourceIndex = prev.columns.findIndex((c) => c.id === sourceColumnId);
      const targetIndex = prev.columns.findIndex((c) => c.id === targetColumnId);
      if (sourceIndex === -1 || targetIndex === -1) return prev;
  
      const origin = prev.columns[sourceIndex];
      const destination = prev.columns[targetIndex];
  
      // 2) Remove do array de origem
      const itemToMove = origin.tasks.find((t) => t.id === draggedTaskId);
      const newSourceTasks = origin.tasks.filter((t) => t.id !== draggedTaskId);
  
      // 3) Copia as tasks da coluna destino e insere o item
      const newTargetTasks = [...destination.tasks];
  
      if (itemToMove) {
        if (hoveredId) {
          const hoverIndex = newTargetTasks.findIndex((t) => t.id === hoveredId);
          if (hoverIndex >= 0) {
            if (insertPosition === "below") {
              newTargetTasks.splice(hoverIndex + 1, 0, itemToMove);
            } else {
              newTargetTasks.splice(hoverIndex, 0, itemToMove);
            }
          } else {
            // hoveredId não encontrada, adiciona no final
            newTargetTasks.push(itemToMove);
          }
        } else {
          // Sem hovered, adicionar no final
          newTargetTasks.push(itemToMove);
        }
      }
  
      // 4) Reordenar a propriedade `order` em ambos
      const finalSource = newSourceTasks.map((task, i) => ({
        ...task,
        order: i + 1,
      }));
      const finalTarget = newTargetTasks.map((task, i) => ({
        ...task,
        order: i + 1,
      }));
  
      // 5) Ajustar no array
      const newColumns = [...prev.columns];
      newColumns[sourceIndex] = {
        ...origin,
        tasks: finalSource,
      };
      newColumns[targetIndex] = {
        ...destination,
        tasks: finalTarget,
      };
  
      return {
        ...prev,
        columns: newColumns,
      };
    });
  }
  
  
  const handleCardDragOver = (e: React.DragEvent<HTMLDivElement>, taskId: string) => {
    e.preventDefault(); // necessário para permitir o drop
    
    if (!draggedTask) return; // se não há item sendo arrastado, não faz nada
    
    // Descobrir posição do mouse em relação ao card
    const boundingRect = e.currentTarget.getBoundingClientRect();
    const middleY = boundingRect.height / 2;
    const offsetY = e.clientY - boundingRect.top; // posição do mouse relativo ao topo do card
  
    // Se estiver acima da metade do card => "above", senão => "below"
    if (offsetY < middleY) {
      setInsertPosition("above");
    } else {
      setInsertPosition("below");
    }
  
    // Guardamos qual card está sendo "hovered"
    setHoveredTaskId(taskId);
  };

  return (
    <HeaderLayout>
      <div className="flex flex-col w-[100%] pt-[60px] mt-10 mb-10 ml-0 justify-center">
        {/* Cabeçalho do Kanban */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 ml-32">Resultado 1</h1>
          <span className="text-xl text-gray-600 font-medium mr-32">2024</span>
        </div>
  
        {/* Kanban */}
        <div className="flex space-x-6 justify-center">
          {kanbanData.columns.map((column: Column, index: number) => (
            <OkrColumns 
            column={column} 
            onDragOver={onDragOver} 
            onDrop={onDrop} 
            handleCardDragOver={handleCardDragOver} 
            handleAddTask={handleAddTask} 
            onDragStart={onDragStart}
            key={index}
            />
          ))}
        </div>
      </div>
    </HeaderLayout>
  );
  
}
