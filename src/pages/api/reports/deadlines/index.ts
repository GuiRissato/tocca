import type { NextApiRequest, NextApiResponse } from 'next';
import toccaAPI from '../../../../../api';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === 'POST'){
        try {
            const { projectId, year } = req.body;
            const response = await toccaAPI.post('/files/deadlines', {
                projectId,
                year,
              });
              return res.status(200).json(response.data);
        } catch (error: unknown) {            
            if (axios.isAxiosError(error)) {
              console.error('Erro ao enviar resposta (Axios):', error.message);
              return res
                .status(error.response?.status || 500)
                .json({ message: error.response?.data?.message || error.message });
            } else {
              console.error('Erro ao enviar resposta (Desconhecido):', error);
              return res.status(500).json({ message: 'Erro interno' });
            }
          }
    }else {
        return res.status(405).json({ message: 'Método não permitido' });
    }
}