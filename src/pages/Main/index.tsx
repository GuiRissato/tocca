// src/components/MainPage.tsx
import React, { useEffect, useState } from 'react';
import UserList from '../../components/UserListProps'; 
import UserUpdateModal from '../../components/UserUpdateModal'; 
import UserDeleteConfirmationModal from '../../components/UserDeleteModal';
import api from '../../interface/API';

interface UserData {
  id: number;
  user_name: string;
  name: string;
  age: number;
}

const Main: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] = useState(false);

  async function fetchUsers() {
    try {
      const response = await api.get('/users');
      if (response.status === 200) {
        const data = response.data;
        setUsers(data);
      } else {
        console.error('Erro ao obter a lista de usuários');
      }
    } catch (error) {
      console.error('Erro ao obter a lista de usuários', error);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, [selectedUser,users]);

  const handleEditUserClick = (user: any) => {
    setSelectedUser({...user, password: ''});
    setIsUpdateModalOpen(true);
  };

  const handleDeleteUserClick = (user: UserData) => {
    setSelectedUser(user);
    setIsDeleteConfirmationModalOpen(true);
  };

  const handleConfirmDeleteUser = async () => {
    await api.delete(`/destroy/${selectedUser.id}`)
    setIsDeleteConfirmationModalOpen(false);
  };

  return (
    <>
      <h1>Lista de Usuários</h1>
      {users.length === 0 ? (
        <div>Carregando...</div>
      ) : (
        <UserList users={users} 
        onEditUserClick={handleEditUserClick} 
        onDeleteUserClick={handleDeleteUserClick}
        />
      )}

      {selectedUser && (
        <UserUpdateModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          user={selectedUser}
        />
      )}

      {selectedUser && (
        <UserDeleteConfirmationModal
          isOpen={isDeleteConfirmationModalOpen}
          onClose={() => setIsDeleteConfirmationModalOpen(false)}
          onDelete={handleConfirmDeleteUser}
          user={selectedUser}
        />
      )}
    </>
  );
};

export default Main;
