import React, {useState,useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import UserRegistrationModal from '../../components/UserRegistrationModal';
import Cookies from 'js-cookie';

import './styles.css';
import api from '../../interface/API';

const Login: React.FC = () =>{

  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  
  const handleLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Previne a recarga da página
  
    try {
      // Enviar dados para a API
      await api.post('/login', {
        user_name: username,
        password: password,
      }).then((res:any) => {
        if (res.status === 200) {
          Cookies.set('user-cookie',res.data.userFormatted.id)
          navigate('/main');
        } else {
          // Tratar erros de autenticação
          console.error('Erro de autenticação');
        }
      });
      // Verificar a resposta da API e realizar ações adequadas, por exemplo, redirecionar para a página de usuários
    } catch (error) {
      // Tratar erros de requisição, por exemplo, falha na conexão com a API
      console.error('Erro ao fazer login', error);
    }
  };
  

  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar a abertura/fechamento da modal

  const handleRegisterClick = () => {
    setIsModalOpen(true); // Abra a modal ao clicar no botão
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Feche a modal
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form className="login-form">
      <label htmlFor="username">Usuário:</label>
        <input type="text" id="username" value={username} onChange={handleUsernameChange} />
        <label htmlFor="password">Senha:</label>
        <input type="password" id="password" value={password} onChange={handlePasswordChange} />
        <button type="submit" onClick={handleLogin}>Entrar</button>
      </form>
      <button className="register-button" onClick={handleRegisterClick}>
        Cadastrar Usuário
      </button>
      <UserRegistrationModal isOpen={isModalOpen} onClose={handleCloseModal}/> {/* Renderize a modal */}
    </div>
  );
}

export default Login