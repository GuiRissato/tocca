import React from 'react';

interface UserListProps {
  users: UserData[];
  onEditUserClick: (user: UserData) => void;
  onDeleteUserClick: (user: UserData) => void;
}

interface UserData {
  id: number;
  user_name: string;
  name: string;
  age: number;
}

const UserList: React.FC<UserListProps> = ({ users, onEditUserClick, onDeleteUserClick }) => {
  return (
    <div>
      <h2>Lista de Usuários</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <strong>Nome de Usuário:</strong> {user.user_name}<br />
            <strong>Nome:</strong> {user.name}<br />
            <strong>Idade:</strong> {user.age}<br />
            <button onClick={() => onEditUserClick(user)}>Editar</button>
            <button onClick={() => onDeleteUserClick(user)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
