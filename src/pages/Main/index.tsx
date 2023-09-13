// src/components/MainPage.tsx
import React, { useEffect, useState } from 'react';
import UserList from '../../components/UserListProps';
import api from '../../interface/API';

interface UserListProps {
  users: UserData[]; 
}

interface UserData {
  id: number;
  user_name: string;
  name: string;
  age: number;
}

const Main: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  
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
  }, []);

  return (
  <>
    { users.length == 0 
      ?
      <div>Carregando...</div>
      :
        <div>
          <UserList users={users} /> {/* Renderize o componente UserList com os dados dos usuários */}
        </div>

    }


  </>
  );
};

export default Main;
