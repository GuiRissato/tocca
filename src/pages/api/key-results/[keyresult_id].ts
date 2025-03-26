import type { NextApiRequest, NextApiResponse } from 'next';
import toccaAPI from '../../../../api';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { keyresult_id } = req.query;

    if(req.method === 'PATCH'){
        try {
            const { key_result_name, status, description, start_date, end_date } = req.body;
            
            const response = await toccaAPI.patch(`/key-results/${keyresult_id}`, {
                key_result_name,
                description,
                start_date,
                status,
                end_date,
                updated_at: new Date()
            });
            
            return res.status(200).json(response.data);
        } catch (error: unknown) {            
            if (axios.isAxiosError(error)) {
              console.error('Erro ao atualizar resultado chave (Axios):', error.message);
              return res
                .status(error.response?.status || 500)
                .json({ message: error.response?.data?.message || error.message });
            } else {
              console.error('Erro ao atualizar resultado chave (Desconhecido):', error);
              return res.status(500).json({ message: 'Erro interno' });
            }
        }
    } else {
        return res.status(405).json({ message: 'Método não permitido' });
    }
}
