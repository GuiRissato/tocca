// src/components/UserList.tsx
import React, { useEffect } from 'react';

interface UserListProps {
  users: UserData[]; // Array de objetos de usuário
}

interface UserData {
  id: number;
  user_name: string;
  name: string;
  age: number;
}

const UserList: React.FC<UserListProps> = ({ users }) => {

    useEffect(()=>{
        console.log('users',users)
    },[])
  return (
    <div>
      <h2>Lista de Usuários</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <strong>Nome de Usuário:</strong> {user.user_name}<br />
            <strong>Nome:</strong> {user.name}<br />
            <strong>Idade:</strong> {user.age}<br />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
