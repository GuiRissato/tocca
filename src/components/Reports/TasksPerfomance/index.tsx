import React from 'react';
import pdfMake from 'pdfmake/build/pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(pdfMake as any).addVirtualFileSystem(pdfFonts);

// Interfaces dos dados retornados pela API
interface ColumnData {
  columnName: string;
  percentage: number;
  color: string;
}

interface PerformanceByObjective {
  objectiveName: string;
  columns: ColumnData[];
}

interface DelayedTasks {
  totalDelayedTasks: number;
  delayedTasksByPriority: {
    high: number;
    medium: number;
    low: number;
  };
  delayReasons: Array<{ reason: string; count: number }>;
}

interface TaskPerformanceData {
  projectId: number;
  projectName: string;
  performanceByObjective: PerformanceByObjective[];
  delayedTasks: DelayedTasks;
}

// Exemplo de estilo para barra de progresso
const generateProgressBar = (percentage: number, color: string) => {
  return [
    {
      canvas: [
        {
          type: 'rect',
          x: 0,
          y: 0,
          w: 200, // Alterar largura conforme necessidade
          h: 8,
          color: '#E0E0E0',
        },
        {
          type: 'rect',
          x: 0,
          y: 0,
          w: (percentage / 100) * 200,
          h: 8,
          color: color,
        },
      ],
      margin: [0, 0, 0, 4],
    },
    {
      text: `${percentage}%`,
      margin: [0, 0, 0, 8],
    },
  ];
};

export default function TaskPerformance() {
  // Exemplo de dados fixos, mas em produção você receberá 'data' via requisição
  const taskPerformanceData: TaskPerformanceData = {
    projectId: 1,
    projectName: 'Project 1',
    performanceByObjective: [
      {
        objectiveName: 'Objective 1',
        columns: [
          { columnName: 'Column A', percentage: 80, color: '#2F80ED' },
          { columnName: 'Column B', percentage: 50, color: '#F2994A' },
        ],
      },
      {
        objectiveName: 'Objective 2',
        columns: [
          { columnName: 'Column A', percentage: 30, color: '#F2C94C' },
          { columnName: 'Column B', percentage: 60, color: '#81C784' },
          { columnName: 'Column C', percentage: 90, color: '#E57373' },
        ],
      },
    ],
    delayedTasks: {
      totalDelayedTasks: 2,
      delayedTasksByPriority: { high: 1, medium: 1, low: 0 },
      delayReasons: [
        { reason: 'Bloqueio de recursos', count: 1 },
        { reason: 'Dependência de terceiros', count: 1 },
      ],
    },
  };

  // Exemplo de docDefinition adaptado para o novo formato de dados
  const generateDocDefinition = (data: TaskPerformanceData): TDocumentDefinitions => {
    return {
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 60],
      content: [
        {
          text: 'TOCCA',
          style: 'header',
          alignment: 'center',
          color: '#E65100',
        },
        {
          text: `Relatório de Desempenho de Tarefas - ${data.projectName}`,
          style: 'subheader',
          alignment: 'center',
          margin: [0, 20, 0, 20],
        },
        {
          text: 'Performance por Objetivo',
          style: 'subheader',
          margin: [0, 10, 0, 10],
        },
        // Mapeia cada objetivo e seus dados
        ...data.performanceByObjective.flatMap((obj) => {
          return [
            { text: obj.objectiveName, bold: true, margin: [0, 10, 0, 5] },
            ...obj.columns.flatMap((col) => [
              { text: col.columnName },
              ...generateProgressBar(col.percentage, col.color),
            ]),
          ];
        }),

        {
          text: 'Tarefas Atrasadas',
          style: 'subheader',
          margin: [0, 20, 0, 10],
        },
        {
          text: `Total de Tarefas Atrasadas: ${data.delayedTasks.totalDelayedTasks}`,
        },
        {
          ul: [
            `Prioridade Alta: ${data.delayedTasks.delayedTasksByPriority.high}`,
            `Prioridade Média: ${data.delayedTasks.delayedTasksByPriority.medium}`,
            `Prioridade Baixa: ${data.delayedTasks.delayedTasksByPriority.low}`,
          ],
          margin: [0, 5, 0, 5],
        },
        {
          text: 'Motivos de Atraso:',
          margin: [0, 5, 0, 5],
          bold: true,
        },
        {
          ul: data.delayedTasks.delayReasons.map(
            (reasonObj) => `${reasonObj.reason} - ${reasonObj.count} ocorrências`
          ),
        },
      ],
      styles: {
        header: {
          fontSize: 22,
          bold: true,
        },
        subheader: {
          fontSize: 16,
          bold: true,
        },
      },
    };
  };

  const gerarPDF = () => {
    const docDefinition = generateDocDefinition(taskPerformanceData);
    pdfMake.createPdf(docDefinition).download('relatorio-performance.pdf');
  };

  return (
    <div>
      <h2>Relatório de Desempenho</h2>
      <button onClick={gerarPDF}>Gerar PDF</button>
    </div>
  );
}