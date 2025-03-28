import type { NextApiRequest, NextApiResponse } from 'next';
import toccaAPI from '../../../../api';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === 'POST'){
        try {
            
            const {task_name, description, priority, due_date, column_key_result_id, key_result_id, tags, assignees} = req.body;
            const response = await toccaAPI.post('/tasks',{
                task_name,
                description,
                priority,
                due_date,
                delay_reason: '',
                column_key_result_id,
                key_result_id
            });

            for (const tagId of tags) {
                await toccaAPI.post('/task-tags',{
                    task_id: response.data.id,
                    tag_id: tagId
                });
            }
            for (const assigneeId of assignees) {
                await toccaAPI.post('/task-assingees',{
                    task_id: response.data.id,
                    user_id: assigneeId
                });
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