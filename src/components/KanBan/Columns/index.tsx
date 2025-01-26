
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

interface OkrColumnsProps {
    column: Column;  
    onDragOver: (event: React.DragEvent<HTMLDivElement>) => void;
    onDrop: (event: React.DragEvent<HTMLDivElement>, columnId: string) => void;
    handleCardDragOver: (event: React.DragEvent<HTMLDivElement>, taskId: string) => void;
    handleAddTask: (columnId: string) => void;
    onDragStart: (task: Task, sourceColumn: string) => void;
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
                <div
                    key={task.id}
                    className="bg-[#C2C2C2] mb-4 rounded-lg p-3 shadow-sm relative"
                    draggable
                    onDragStart={() => props.onDragStart(task, props.column.id)}
                    onDragOver={(e) => props.handleCardDragOver(e, task.id)}
                >
                    <h3 className="text-md font-medium text-gray-800">
                    {task.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                    {task.description}
                    </p>
                </div>
                ))}
            </div>

            {/* Botão Criar Tarefa */}
            <button
            onClick={() => props.handleAddTask(props.column.id)}
            className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-lg"
            >
            + Criar Tarefa
            </button>
        </div>

    )
}

