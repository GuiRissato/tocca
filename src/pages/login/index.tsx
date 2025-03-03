import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import {jwtDecode} from 'jwt-decode';
import { setUser } from '@/store/userSlice';
import Image from 'next/image';
import logo from '../../assets/logoTocca.png';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await fetch('/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (result.ok) {
        const data = await result.json();
        
        interface DecodedToken {
          username: string;
          id: number;
          companyId: number;
        }

        const decodedToken: DecodedToken = jwtDecode<DecodedToken>(data.token);

        dispatch(
          setUser({
            id: decodedToken.id,
            username: decodedToken.username,
            companyId: decodedToken.companyId,
          })
        );

        router.push('/okr');
      } else {
        console.error('Erro no login:', result.statusText);
        alert('Credenciais inválidas ou erro no servidor');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      alert('Credenciais inválidas ou erro no servidor');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-md p-6 shadow-md bg-[#E4E3E3] border border-black">
        <Image
          src={logo}
          alt="Logo Tocca"
          width={200}
          height={100}
          className="mx-auto"
        />
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring"
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring"
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="agreeTerms"
              checked={agreeTerms}
              onChange={() => setAgreeTerms(!agreeTerms)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="agreeTerms" className="ml-2 text-sm text-gray-600">
              I have read and agree to the{' '}
              <a href="#" className="text-blue-500 hover:underline">
                privacy policy and terms
              </a>
            </label>
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;