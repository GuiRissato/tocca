import type { NextApiRequest, NextApiResponse } from 'next';
import toccaAPI from '../../../../api';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === 'POST'){
        try {
            const {objective_id, key_result_name,status, description, start_date, end_date} = req.body;
            const response = await toccaAPI.post('/key-results', {
                objective_id,
                key_result_name,
                description,
                start_date,
                status,
                end_date,
                created_at: new Date(),
                updated_at: new Date()
              });

              const columns_key_results = [
                {
                  column_name: 'Para Fazer',
                  position: 1,
                  key_result_id: response.data.id
                },
                {
                  column_name: 'Pendente',
                  position: 2,
                  key_result_id: response.data.id
                },
                {
                  column_name: 'Em Progresso',
                  position: 3,
                  key_result_id: response.data.id
                },
                {
                  column_name: 'Finalizado',
                  position: 4,
                  key_result_id: response.data.id
                },
                {
                  column_name: 'Fechado',
                  position: 5,
                  key_result_id: response.data.id
                },
              ]

              for(const column of columns_key_results){

                await toccaAPI.post('/columns-key-result', {
                  column_name: column.column_name,
                  position: column.position,
                  key_result_id: column.key_result_id
                })
              }

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