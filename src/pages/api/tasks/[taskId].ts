
import type { NextApiRequest, NextApiResponse } from 'next';
import toccaAPI from '../../../../api';
import axios from 'axios';
import { TaskTag } from '@/components/Modal/Task/edit';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === 'PATCH'){
        try {
            const { taskId } = req.query;
            const {
              task_name,
              description,
              priority,
              due_date,
              column_key_result_id,
              key_result_id,
              tags,
              users
            } = req.body;

            const response = await toccaAPI.patch(`/tasks/${taskId}`,{
                task_name,
                description,
                priority,
                due_date,
                delay_reason: '',
                column_key_result_id,
                key_result_id
            });

            const taskTagResponse = await toccaAPI.get(`/task-tags/${taskId}`);
            const currentTags = taskTagResponse.data || [];

            const taskAssigneesResponse = await toccaAPI.get(`/task-assingnees/${taskId}`);
            const currentAssignees = taskAssigneesResponse.data || [];

            if (tags && Array.isArray(tags)) {

                const tagsToRemove = currentTags
                          .filter((currentTag: TaskTag) => !tags.includes(currentTag.tag_id))
                          .map((tag: TaskTag) => tag.tag_id);
              
                const currentTagIds: string[] = currentTags.map((tag: TaskTag) => tag.tag_id);
                const tagsToAdd = tags.filter(tagId => !currentTagIds.includes(tagId));

                for (const tagRelationId of tagsToRemove) {
                    await toccaAPI.delete(`/task-tags/${taskId}/${tagRelationId}`);
                }

                for (const tagId of tagsToAdd) {
                    await toccaAPI.post('/task-tags', {
                        task_id: Number(taskId),
                        tag_id: Number(tagId)
                    });
                }
            }
            
            // Process assignees updates
            if (users && Array.isArray(users)) {
                interface CurrentAssignee {
                  id: number;
                  user_id: number;
                }

                const assigneesToRemove = currentAssignees
                          .filter((currentAssignee: CurrentAssignee) => !users.includes(currentAssignee.user_id))
                          .map((assignee: CurrentAssignee) => assignee.user_id);
                const currentAssigneeIds: string[] = currentAssignees.map((assignee: { user_id: number }) => assignee.user_id);
                const assigneesToAdd = users.filter(userId => !currentAssigneeIds.includes(userId));

                for (const assigneeRelationId of assigneesToRemove) {
                    await toccaAPI.delete(`/task-assingnees/${taskId}/${assigneeRelationId}`);
                }

                for (const userId of assigneesToAdd) {
                    await toccaAPI.post('/task-assingnees', {
                        task_id: Number(taskId),
                        user_id: Number(userId)
                    });
                }
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
    } else {
        return res.status(405).json({ message: 'Método não permitido' });
    }
}
