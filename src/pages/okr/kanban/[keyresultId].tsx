/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import HeaderLayout from "@/components/HeaderLayout";
import "../../../app/globals.css";
import OkrColumns from "@/components/KanBan/Columns";
import CreateTaskModal from "@/components/Modal/Task/create";
import EditTaskModal, { TaskTag, TaskUser } from "@/components/Modal/Task/edit";
import DelayedTaskModal from "@/components/Modal/Task/delayReason";
import { GetServerSideProps } from "next";
import SelectYearButton from "@/components/SelectYearButton";
import { DecodedToken } from "@/pages/login";
import { jwtDecode } from "jwt-decode";

interface Tag {
  task_id: number;
  tag_id: number;
  tag_name: string;
  created_at: string;
  updated_at: string;
}

interface Assignee {
  task_id: number;
  user_id: number;
  email: string;
  created_at: string;
  updated_at: string;
}

interface ApiTask {
  id: string;
  key_result_id: number;
  task_name: string;
  description: string;
  delay_reason: string;
  priority: number;
  due_date: string;
  column_key_result_id: number;
  created_at: string;
  updated_at: string;
  tags: Tag[];
  assignees: Assignee[];
}

interface ApiColumn {
  column_id: number;
  column_name: string;
  tasks: ApiTask[];
}

interface ApiResponse {
  key_result_id: string;
  key_result_name: string;
  columns: ApiColumn[];
}

interface Task {
  id: string;
  title: string;
  description: string;
  estimatedTime?: string;
  order: number;
  priority?: string;
  comments?: string[];
  tags?: string[] | TaskTag[];
  users?: string[] | TaskUser[];
  dueDate?: string;
  delayReason?: string;
  column_key_result_id: number;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

interface KanbanData {
  columns: Column[];
}

interface KanbanProps {
  initialData: KanbanData;
  keyresultName: string;
  keyresultId: string;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { keyresultId } = context.params || {};
  
  try {
    const protocol = context.req.headers["x-forwarded-proto"] || "http";
    const host = context.req.headers.host;
    const baseUrl = `${protocol}://${host}`;

    const response = await fetch(`${baseUrl}/api/key-results/tasks/${keyresultId}`,{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar dados: ${response.status}`);
    }
    
    const apiData: ApiResponse = await response.json();
    
    // Mapear os dados da API para o formato esperado pelo componente
    const mappedData: KanbanData = {
      columns: apiData.columns.map(column => ({
        id: column.column_id.toString(),
        title: column.column_name,
        tasks: column.tasks.map((task, index) => ({
          id: task.id.toString(),
          title: task.task_name,
          description: task.description,
          order: index + 1,
          priority: task.priority.toString(),
          dueDate: task.due_date,
          delayReason: task.delay_reason,
          tags: task.tags.map(tag => tag.tag_name),
          users: task.assignees.map(assignee => assignee.email),
          column_key_result_id: column.column_id
        }))
      }))
    };

    return {
      props: {
        initialData: mappedData,
        keyresultId: keyresultId,
        keyresultName: apiData.key_result_name,
      },
    };
  } catch (error) {
    console.error("Erro ao buscar dados do Kanban:", error);

    return {
      props: {
        initialData: {
          columns: [
            {
              id: "column-1",
              title: "Para Fazer",
              tasks: [],
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
        },
        keyresultId: keyresultId || null,
        keyresultName: "Resultado não encontrado",
      },
    };
  }
};

export default function Kanban({ initialData, keyresultName, keyresultId }: Readonly<KanbanProps>) {
  
  const [kanbanData, setKanbanData] = useState<KanbanData>(initialData);
  const [draggedTask, setDraggedTask] = useState<{
    task: Task;
    sourceColumnId: string;
  } | null>(null);
  
  const [hoveredTaskId, setHoveredTaskId] = useState<string | null>(null);
  const [insertPosition, setInsertPosition] = useState<"above" | "below" | null>(null);
  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [openDelayedTask, setOpenDelayedTask] = useState<boolean>(false);
  const [currentTaskId, setCurrentTaskId] = useState<number>();
  const [currentColumnId, setCurrentColumnId] = useState<string | null>(null);

  const onDragStart = (task: Task, columnId: string) => {
    setDraggedTask({ task, sourceColumnId: columnId });
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleAddTask = (columnId: string) => {
    setCurrentColumnId(columnId);
    setOpenCreateModal(true);
  };

  const handleEditTask = (taskId: number, columnId: string) => {
    setCurrentTaskId(taskId);
    setCurrentColumnId(columnId);
    setOpenEditModal(true);
  };

  const handleDelayedTask = (taskId: number, columnId: string) =>{
    setCurrentTaskId(taskId);
    setCurrentColumnId(columnId);
    setOpenDelayedTask(true);
  }

  const updateTaskColumn = async (taskId: string, columnId: string) => {
    try {
      const response = await fetch(`/api/tasks/move/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          column_key_result_id: parseInt(columnId)
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Error updating task column: ${response.status}`);
      }
  
      return true;
    } catch (error) {
      console.error("Error updating task column:", error);
      return false;
    }
  };
  
  const handleCreateTask = async (taskData: {
    title: string;
    description: string;
    estimatedTime?: string;
    priority?: string;
    tags?: string[];
    responsibles?: string[];
    columnId: string;
  }) => {
    try {
      // Prepare the data for the API
      const apiTaskData = {
        task_name: taskData.title,
        description: taskData.description,
        priority: taskData.priority ? parseInt(taskData.priority) : 1,
        due_date: taskData.estimatedTime || null,
        column_key_result_id: parseInt(taskData.columnId || "0"),
        key_result_id: parseInt(keyresultId),
        tags: taskData.tags || [],
        assignees: taskData.responsibles || []
      };
  
      // Make the API call to create the task
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiTaskData),
      });
  
      if (!response.ok) {
        throw new Error(`Error creating task: ${response.status}`);
      }
  
      // Refresh the kanban data after successful task creation
      await refreshKanbanData();
      
    } catch (error) {
      console.error("Error creating task:", error);
      // Here you could add error handling, like showing a message to the user
    }
  };

  const handleUpdateTask = async (taskData: {
    id: string;
    title: string;
    description: string;
    estimatedTime?: string;
    priority?: string;
    tags?: number[];
    responsibles?: number[];
    columnId: number;
  }) => {
    try {

      const apiTaskData = {
        id: taskData.id,
        task_name: taskData.title,
        description: taskData.description,
        priority: taskData.priority ? parseInt(taskData.priority) : 1,
        due_date: taskData.estimatedTime || null,
        column_key_result_id: taskData.columnId,
        key_result_id: parseInt(keyresultId),
        tags: taskData.tags || [],
        users: taskData.responsibles || []
      }

      const response = await fetch(`/api/tasks/${apiTaskData.id}`,{
        method: 'PATCH',
        headers:{
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiTaskData)
      })

      if (!response.ok) {
        throw new Error(`Error updating task: ${response.status}`);
      }

      await refreshKanbanData();

    } catch (error) {
      console.error("Error updating task:", error);
    }
  }

  const refreshKanbanData = async () => {
    try {
      const response = await fetch(`/api/key-results/tasks/${keyresultId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.status}`);
      }
      
      const apiData: ApiResponse = await response.json();
      
      // Map the API data to the expected format
      const mappedData: KanbanData = {
        columns: apiData.columns.map(column => ({
          id: column.column_id.toString(),
          title: column.column_name,
          tasks: column.tasks.map((task, index) => ({
            id: task.id.toString(),
            title: task.task_name,
            description: task.description,
            order: index + 1,
            priority: task.priority.toString(),
            dueDate: task.due_date,
            delayReason: task.delay_reason,
            tags: task.tags.map(tag => tag.tag_name),
            users: task.assignees.map(assignee => assignee.email),
            column_key_result_id: column.column_id
          }))
        }))
      };
  
      setKanbanData(mappedData);
    } catch (error) {
      console.error("Error refreshing kanban data:", error);
    }
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
      updateTaskColumn(task.id, targetColumnId);
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
          <h1 className="text-2xl font-bold text-gray-800 ml-[2%]">{keyresultName}</h1>
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
              handleEditTask={handleEditTask} 
              onDragStart={onDragStart}
              handleDelayedTask={handleDelayedTask}
              key={column.id}
            />
          ))}
        </div>
        {(openCreateModal && currentColumnId) && (
          <CreateTaskModal 
            open={openCreateModal} 
            onClose={setOpenCreateModal} 
            columnId={currentColumnId}
            onCreateTask={handleCreateTask}
          />
        )}
        {(openEditModal && currentTaskId && currentColumnId) && (
        (() => {
          const taskData = kanbanData.columns
            .find((c) => c.id === currentColumnId)
            ?.tasks.find((t) => Number(t.id) === currentTaskId);
          if (!taskData) {
            return null;
          }
            return (
              <EditTaskModal 
                open={openEditModal}
                onClose={setOpenEditModal}
                taskData={taskData}
                currentTaskId={currentTaskId}
                onUpdateTask={handleUpdateTask}
              />
            );
          })()
        )}
        {(openDelayedTask && currentTaskId && currentColumnId) && (
          <DelayedTaskModal refreshKanban={refreshKanbanData} open={openDelayedTask} onClose={setOpenDelayedTask} taskId={currentTaskId} taskData={kanbanData.columns.find((c) => c.id === currentColumnId)?.tasks.find((t) => Number(t.id) === currentTaskId)?.delayReason} />
        )}
      </div>
    </HeaderLayout>
  );
}