/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect } from 'react';
import Modal from '../index';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface Tag {
  id: string;
  tag_name: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

export interface TaskTag {
  task_id: number;
  tag_id: number;
  created_at: string;
  updated_at: string;
  tag_name: string;
}

export interface TaskUser {
  task_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  email: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  estimatedTime?: string;
  order: number;
  priority?: string;
  dueDate?: string;
  comments?: string[];
  tags?: TaskTag[] | string[];
  users?: TaskUser[] | string[];
  responsibles?: number[];
  delayReason?: string;
  column_key_result_id: number
}

interface EditTaskModalProps {
  open: boolean;
  onClose: (value: boolean) => void;
  taskData: Task;
  onUpdateTask: (task: {
    id: string;
    title: string;
    description: string;
    estimatedTime?: string;
    priority?: string;
    tags?: number[];
    responsibles?: number[];
    columnId: number;
  }) => void;
  currentTaskId: number;
}

// Helper function to format Date objects into the "yyyy-MM-ddThh:mm" format required by input[type="datetime-local"]
function formatDateTimeLocal(date: Date): string {
  const year = date.getFullYear();
  const month = ('0' + (date.getMonth() + 1)).slice(-2);
  const day = ('0' + date.getDate()).slice(-2);
  const hours = ('0' + date.getHours()).slice(-2);
  const minutes = ('0' + date.getMinutes()).slice(-2);
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export default function EditTaskModal(props: Readonly<EditTaskModalProps>) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('');
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [errors, setErrors] = useState<{ title?: string }>({});
  const user = useSelector((state: RootState) => state.user);

  // Mock data for tags and users - replace with actual data fetching
  const [tags, setTags] = useState<Tag[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const fetchTags = async () => {
    const response = await fetch(`/api/tags/${user.companyId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    setTags(data);
  };

  const fetchUsers = async () => {
    const response = await fetch(`/api/user/${user.companyId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
    fetchTags();
  }, []);

  useEffect(() => {
    if (props.taskData && props.open && users.length > 0 && tags.length > 0) {
      setTitle(props.taskData.title || '');
      setDescription(props.taskData.description || '');
      setDueDate(props.taskData.dueDate ? formatDateTimeLocal(new Date(props.taskData.dueDate)) : '');
      setPriority(props.taskData.priority || '');
      
      if (props.taskData.tags && props.taskData.tags.length > 0) {
        const tagsIdArray: Array<number> = [];
        for(const tag_id of props.taskData.tags){
          const tagId = tags.find((tag)=> tag.tag_name === String(tag_id))?.id
          tagsIdArray.push(Number(tagId));
        }
        setSelectedTags(tagsIdArray);
      } else {
        setSelectedTags([]);
      }
      
      if (props.taskData.users && props.taskData.users.length > 0) {
        const userIdArray: Array<number> = [];
        for(const user_id of props.taskData.users){
          const userId = users.find((user)=> user.email === String(user_id))?.id
          userIdArray.push(Number(userId));
        }
        setSelectedUsers(userIdArray);
        
      } else {
        setSelectedUsers([]);
      }
    }
  }, [props.taskData, props.open, users, tags]);

  useEffect(() => {
    if (!props.open) {
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('');
      setSelectedTags([]);
      setSelectedUsers([]);
      setErrors({});
    }
  }, [props.open]);

  const handleTagToggle = (tagId: string) => {
    const numericTagId = parseInt(tagId, 10);
    if (selectedTags.includes(numericTagId)) {
      setSelectedTags(selectedTags.filter(id => id !== numericTagId));
    } else {
      setSelectedTags([...selectedTags, numericTagId]);
    }
  };

  const handleUserToggle = (userId: string) => {
    const numericUserId = parseInt(userId, 10);
    if (selectedUsers.includes(numericUserId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== numericUserId));
    } else {
      setSelectedUsers([...selectedUsers, numericUserId]);
    }
  };

  const validateForm = () => {
    const newErrors: { title?: string } = {};
    
    if (!title.trim()) {
      newErrors.title = 'O título é obrigatório';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    const updateTask = {
      id: props.taskData?.id || String(props.currentTaskId),
      title,
      description,
      estimatedTime: props.taskData?.dueDate,
      priority,
      tags: selectedTags,
      responsibles: selectedUsers,
      columnId: props.taskData?.column_key_result_id,
    };

    props.onUpdateTask(updateTask);

    props.onClose(false);
  };

  return (
    <>
      <Modal
        isOpen={props.open}
        onClose={() => props.onClose(false)}
        title="Editar Tarefa"
        footer={
          <button
            onClick={handleSave}
            className="px-10 py-2 text-black bg-[#D9D894] rounded-full hover:bg-[#D9D894AA]"
          >
            Salvar
          </button>
        }
      >
        <form>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="title">
              Título
            </label>
            <input
              id="title"
              type="text"
              className={`w-full px-4 py-2 border bg-[#D4D4D4] rounded-lg focus:outline-none focus:ring focus:ring-blue-300 ${errors.title ? 'border-red-500' : ''}`}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="description">
              Descrição
            </label>
            <textarea
              id="description"
              className="w-full px-4 py-2 border bg-[#D4D4D4] rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="dueDate">
                Data de Entrega
              </label>
              <input
                id="dueDate"
                type="datetime-local"
                className="w-full px-4 py-2 border bg-[#D4D4D4] rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="priority">
                Prioridade
              </label>
              <select
                id="priority"
                className="w-full px-4 py-2 border bg-[#D4D4D4] rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="">Selecione</option>
                <option value="1">Baixa</option>
                <option value="2">Média</option>
                <option value="3">Alta</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 p-2 border bg-[#D4D4D4] rounded-lg">
              {tags.length > 0 && tags.map(tag => (
                <div 
                  key={tag.id}
                  onClick={() => handleTagToggle(tag.id)}
                  className={`px-3 py-1 rounded-full cursor-pointer text-sm ${
                    selectedTags.includes(parseInt(tag.id, 10)) 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {tag.tag_name}
                </div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Responsáveis
            </label>
            <div className="flex flex-col gap-2 p-2 border bg-[#D4D4D4] rounded-lg max-h-40 overflow-y-auto">
              {users.length > 0 && users.map(user => (
                <div 
                  key={user.id}
                  className="flex items-center"
                >
                  <input
                    type="checkbox"
                    id={`user-${user.id}`}
                    checked={selectedUsers.includes(parseInt(user.id, 10))}
                    onChange={() => handleUserToggle(user.id)}
                    className="mr-2"
                  />
                  <label htmlFor={`user-${user.id}`} className="cursor-pointer">
                    <span className="font-medium">{user.name}</span>
                    <span className="text-sm text-gray-500 ml-1">({user.email})</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
}
