/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import Modal from '../index';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface User {
    id: string;
    name: string;
    email: string;
}

interface Tag {
    id: string;
    tag_name: string;
    created_at: Date;
    updated_at: Date;
    company_id: number;
}

interface ModalProps {
    open: boolean;
    onClose: (value: boolean) => void;
    columnId: string;
    onCreateTask: (task: {
        title: string;
        description: string;
        estimatedTime?: string;
        priority?: string;
        tags?: string[];
        responsibles?: string[];
        columnId: string;
    }) => void;
}

export default function CreateTaskModal(props: Readonly<ModalProps>) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [estimatedTime, setEstimatedTime] = useState('');
    const [priority, setPriority] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [errors, setErrors] = useState<{[key: string]: string}>({});
    const user = useSelector((state: RootState) => state.user);
    
    // Mock de dados - em produção, estes viriam de uma API
    const [users, setUsers] = useState<User[]>([]);
    
    const [tags, setTags] = useState<Tag[]>([]);

    const fetchTags = async () => {
      const response = await fetch(`/api/tags/${user.companyId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
      }
      );
      const data = await response.json();
      setTags(data);
    };

    const fetchUsers = async () => {

      const response = await fetch(`/api/user/${user.companyId}`,{
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

    const validateForm = () => {
        const newErrors: {[key: string]: string} = {};
        
        if (!title.trim()) {
            newErrors.title = 'O título é obrigatório';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (validateForm()) {
            // Criar objeto da tarefa
            const newTask = {
                title,
                description,
                estimatedTime,
                priority,
                tags: selectedTags,
                responsibles: selectedUsers,
                columnId: props.columnId
            };
            
            // Chamar a função de callback para criar a tarefa
            props.onCreateTask(newTask);
            
            // Fechar o modal
            props.onClose(false);
        }
    };

    const handleTagToggle = (tagId: string) => {
        setSelectedTags(prev => 
            prev.includes(tagId) 
                ? prev.filter(id => id !== tagId) 
                : [...prev, tagId]
        );
    };

    const handleUserToggle = (userId: string) => {
        setSelectedUsers(prev => 
            prev.includes(userId) 
                ? prev.filter(id => id !== userId) 
                : [...prev, userId]
        );
    };

    return (
        <>
            <Modal
                isOpen={props.open}
                onClose={() => props.onClose(false)}
                title="Tarefa"
                footer={
                    <button
                        onClick={handleSave}
                        className="px-10 py-2 text-black bg-[#A7D994] rounded-full hover:bg-[#A7D994AA]"
                    >
                        Criar
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
                            <label className="block mb-2 text-sm font-medium text-gray-700" htmlFor="estimatedTime">
                                Data e hora estimada
                            </label>
                            <input
                                id="estimatedTime"
                                type="datetime-local"
                                className="w-full px-4 py-2 border bg-[#D4D4D4] rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                                value={estimatedTime}
                                onChange={(e) => setEstimatedTime(e.target.value)}
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
                            {tags.length > 0 && tags?.map(tag => (
                                <div 
                                    key={tag.id}
                                    onClick={() => handleTagToggle(tag.id)}
                                    className={`px-3 py-1 rounded-full cursor-pointer text-sm ${
                                        selectedTags.includes(tag.id) 
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
                            {users.length > 0 && users?.map(user => (
                                <div 
                                    key={user.id}
                                    className="flex items-center"
                                >
                                    <input
                                        type="checkbox"
                                        id={`user-${user.id}`}
                                        checked={selectedUsers.includes(user.id)}
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