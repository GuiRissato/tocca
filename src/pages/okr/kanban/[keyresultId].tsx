import { useState } from "react";
import HeaderLayout from "@/components/HeaderLayout";
import "../../../app/globals.css";

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

interface Columns {
  [key: string]: Column;
}

export default function Kanban() {
  
  const [columns, setColumns] = useState<Columns>({
    "column-1": {
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
    "column-2": {
      id: "column-2",
      title: "Pendente",
      tasks: [],
    },
    "column-3": {
      id: "column-3",
      title: "Em Progresso",
      tasks: [],
    },
    "column-4": {
      id: "column-4",
      title: "Finalizado",
      tasks: [],
    },
  });
  const [draggedTask, setDraggedTask] = useState<{
    task: Task;
    sourceColumn: string;
  } | null>(null);
  
  const [hoveredTaskId, setHoveredTaskId] = useState<string | null>(null);
  const [insertPosition, setInsertPosition] = useState<"above" | "below" | null>(null);

  const onDragStart = (task: Task, columnId: string) => {
    setDraggedTask({ task, sourceColumn: columnId });
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Permite o drop
  };

  const handleAddTask = (columnId: string) => {
    const newTaskId = `task-${Math.random().toString(36).substring(2, 10)}`;
    const currentTasks = columns[columnId].tasks;
  
    // Definir a ordem como o próximo maior número
    const maxOrder = currentTasks.length > 0 ? Math.max(...currentTasks.map(task => task.order || 0)) : 0;
  
    const newTask: Task = {
      id: newTaskId,
      title: `Nova Tarefa`,
      description: `Descrição da nova tarefa`,
      order: maxOrder + 1, // Próximo valor na ordem
    };
  
    setColumns((prevColumns) => ({
      ...prevColumns,
      [columnId]: {
        ...prevColumns[columnId],
        tasks: [...prevColumns[columnId].tasks, newTask],
      },
    }));
  };
  
  const onDrop = (e: React.DragEvent<HTMLDivElement>, targetColumnId: string) => {
    e.preventDefault();
    if (!draggedTask) return;
  
    const { task, sourceColumn } = draggedTask;
  
    // 1) Se for a mesma coluna, é reorder
    if (sourceColumn === targetColumnId) {
      reorderInSameColumn(sourceColumn, task.id, hoveredTaskId);
    } 
    // 2) Caso contrário, é movimento para outra coluna
    else {
      moveToAnotherColumn(sourceColumn, targetColumnId, task.id, hoveredTaskId);
    }
  
    setDraggedTask(null);
    setHoveredTaskId(null);
    setInsertPosition(null);
  };

  function reorderInSameColumn(columnId: string, draggedTaskId: string, hoveredId: string | null) {
    setColumns((prev) => {
      const column = prev[columnId];
  
      // Remove a tarefa do array
      let newTasks = column.tasks.filter((t) => t.id !== draggedTaskId);
  
      if (hoveredId) {
        const hoverIndex = newTasks.findIndex((t) => t.id === hoveredId);
        if (hoverIndex >= 0) {
          const draggedItem = columns[columnId].tasks.find((t) => t.id === draggedTaskId);
          if (draggedItem) {
            // Verifica se é "above" ou "below"
            if (insertPosition === "below") {
              newTasks.splice(hoverIndex + 1, 0, draggedItem);
            } else {
              // default = "above"
              newTasks.splice(hoverIndex, 0, draggedItem);
            }
          }
        } else {
          // hoveredId não encontrada, joga no final
          const draggedItem = columns[columnId].tasks.find((t) => t.id === draggedTaskId);
          if (draggedItem) {
            newTasks.push(draggedItem);
          }
        }
      } else {
        // Nenhuma tarefa "hovered", então adiciona no final
        const draggedItem = columns[columnId].tasks.find((t) => t.id === draggedTaskId);
        if (draggedItem) {
          newTasks.push(draggedItem);
        }
      }
  
      // Reordenar a propriedade "order"
      newTasks = newTasks.map((task, index) => ({
        ...task,
        order: index + 1,
      }));
  
      return {
        ...prev,
        [columnId]: {
          ...column,
          tasks: newTasks,
        },
      };
    });
  }
  
  function moveToAnotherColumn(
    sourceColumn: string, 
    targetColumn: string, 
    draggedTaskId: string, 
    hoveredId: string | null
  ) {
    setColumns((prev) => {
      const origin = prev[sourceColumn];
      const destination = prev[targetColumn];
  
      // 1) Remove do array de origem
      const itemToMove = origin.tasks.find((t) => t.id === draggedTaskId);
      const newSourceTasks = origin.tasks.filter((t) => t.id !== draggedTaskId);
  
      // 2) Copia as tasks da coluna destino e insere o item
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
            newTargetTasks.push(itemToMove);
          }
        } else {
          // Sem hovered, adicionar no final
          newTargetTasks.push(itemToMove);
        }
      }
  
      // 3) Reordenar a propriedade `order` em ambos
      const finalSource = newSourceTasks.map((task, i) => ({
        ...task,
        order: i + 1,
      }));
      const finalTarget = newTargetTasks.map((task, i) => ({
        ...task,
        order: i + 1,
      }));
  
      return {
        ...prev,
        [sourceColumn]: {
          ...origin,
          tasks: finalSource,
        },
        [targetColumn]: {
          ...destination,
          tasks: finalTarget,
        },
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
      <div className="container mx-auto pt-[60px] mt-10 mb-10">
        {/* Cabeçalho do Kanban */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Resultado 1</h1>
          <span className="text-xl text-gray-600 font-medium">2024</span>
        </div>

        {/* Kanban */}
        <div className="flex space-x-6">
          {Object.entries(columns).map(([columnId, column]) => (
            <div
              key={column.id}
              className="bg-[#E4E3E3] w-[300px] min-w-[300px] h-[75vh] rounded-lg p-4 shadow-md flex flex-col justify-start flex-shrink-0"
              onDragOver={onDragOver}
              onDrop={(e) => onDrop(e, column.id)}
            >
              {/* Título da Coluna */}
              <div className="text-lg font-semibold text-gray-700 mb-4">
                {column.title}
              </div>

              {/* Tarefas */}
              <div className="overflow-y-auto">
              {column.tasks
                .toSorted((a, b) => (a.order || 0) - (b.order || 0)) // Ordena as tarefas pela propriedade `order`
                .map((task) => (
                <div
                    key={task.id}
                    className="bg-[#C2C2C2] mb-4 rounded-lg p-3 shadow-sm relative"
                    draggable
                    onDragStart={() => onDragStart(task, column.id)}
                    onDragOver={(e) => handleCardDragOver(e, task.id)}
                >
                    <h3 className="text-md font-medium text-gray-800">{task.title}</h3>
                    <p className="text-sm text-gray-600">{task.description}</p>
                </div>
                ))}
              </div>

              {/* Botão Criar Tarefa */}
              <button
                onClick={() => handleAddTask(columnId)}
                className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-lg"
              >
                + Criar Tarefa
              </button>
            </div>
          ))}
        </div>
      </div>
    </HeaderLayout>
  );
}
