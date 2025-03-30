import type { NextApiRequest, NextApiResponse } from 'next';
import toccaAPI from '../../../../../api';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PATCH') {
    try {
      const { taskId } = req.query;
      const { column_key_result_id } = req.body;

      if (!column_key_result_id) {
        return res.status(400).json({ message: 'column_key_result_id is required' });
      }

      // Update only the column_key_result_id field
      const response = await toccaAPI.patch(`/tasks/${taskId}`, {
        column_key_result_id
      });

      return res.status(200).json(response.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error('Erro ao mover tarefa (Axios):', error.message);
        return res
          .status(error.response?.status || 500)
          .json({ message: error.response?.data?.message || error.message });
      } else {
        console.error('Erro ao mover tarefa (Desconhecido):', error);
        return res.status(500).json({ message: 'Erro interno' });
      }
    }
  } else {
    return res.status(405).json({ message: 'Método não permitido' });
  }
}