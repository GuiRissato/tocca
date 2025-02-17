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

function generateCircularChart(
  percentage: number,
  radius = 40,
  color = '#F44336',
  backgroundColor = '#E0E0E0'
) {
  // Ângulo final do arco, em graus
  const endAngle = (percentage / 100) * 360;

  return {
    stack: [
      // O "canvas" desenha os círculos
      {
        canvas: [
          // Círculo de fundo (100%)
          {
            type: 'ellipse',
            x: radius,
            y: radius,
            r1: radius,
            r2: radius,
            lineWidth: 6,
            lineColor: backgroundColor,
            fillOpacity: 0,
            startAngle: 0,
            endAngle: 360,
          },
          // Arco representando a porcentagem
          {
            type: 'ellipse',
            x: radius,
            y: radius,
            r1: radius,
            r2: radius,
            lineWidth: 6,
            lineColor: color,
            fillOpacity: 0,
            startAngle: 0,
            endAngle: endAngle,
          },
        ],
        // Ajuste de margens conforme necessidade
        width: radius * 2,
        height: radius * 2,
      },
      // Texto no centro (finge-se um "overlay")
      {
        text: `${percentage}%`,
        alignment: 'center',
        // Tenta jogar o texto sobre o círculo
        margin: [(radius /2) - 8, -(radius * 2) + 22, 0, 0],
        bold: true,
      },
    ],
    margin: [0, 0, 0, 10],
  };
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
          w: 500, // Alterar largura conforme necessidade
          h: 10,
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
        // Título principal
        {
          text: 'TOCCA',
          style: 'header',
          alignment: 'center',
          color: '#E65100',
        },
        {
          text: `Desempenho das tarefas - ${data.projectName}`,
          style: 'subheader',
          alignment: 'center',
          margin: [0, 10, 0, 20],
        },
  
        // Mapeia cada objetivo
        ...data.performanceByObjective.map((obj) => {
          return {
            style: 'objectiveCard',
            table: {
              widths: ['*'],
              body: [
                [
                  {
                    stack: [
                      { text: `Objetivo: ${obj.objectiveName}`, style: 'objectiveTitle' },
                      { text: 'Resultado', style: 'resultTitle', margin: [0, 5, 0, 5] },
                      // Exemplo de alguma frase
                      {
                        text: 'Tempo médio para conclusão das tarefas:',
                        style: 'regularText',
                        margin: [0, 0, 0, 10],
                      },
                      // Agora as barras
                      ...obj.columns.flatMap((col) => {
                        return [
                          { text: col.columnName, style: 'regularText' },
                          ...generateProgressBar(col.percentage, col.color, 250),
                        ];
                      }),
                    ],
                  },
                ],
              ],
            },
            layout: {
              fillColor: (rowIndex: number) => {
                return rowIndex === 0 ?'#FAFAFA' : null;
              },
              hLineWidth: () => 0,
              vLineWidth: () => 0,
              paddingLeft: () => 10,
              paddingRight: () => 10,
              paddingTop: () => 10,
              paddingBottom: () => 10,
            },
            margin: [0, 0, 0, 20],
          };
        }),
  
        // Agora a parte das tarefas atrasadas
        {
          text: 'Tarefas em Atraso',
          style: 'subheader',
          margin: [0, 10, 0, 10],
        },
        {
          columns: [
            // Coluna do gráfico circular
            {
              width: 'auto',
              stack: [
                generateCircularChart(
                  (data.delayedTasks.totalDelayedTasks / 10) * 100,
                  30,
                  '#F44336',
                  '#E0E0E0'
                ),
              ],
            },
            // Coluna do texto
            {
              width: '*',
              stack: [
                {
                  text: `Total de Tarefas Atrasadas: ${data.delayedTasks.totalDelayedTasks}`,
                  style: 'regularText',
                  margin: [10, 0, 0, 5],
                },
                {
                  ul: [
                    `Prioridade Alta: ${data.delayedTasks.delayedTasksByPriority.high}`,
                    `Prioridade Média: ${data.delayedTasks.delayedTasksByPriority.medium}`,
                    `Prioridade Baixa: ${data.delayedTasks.delayedTasksByPriority.low}`,
                  ],
                  margin: [10, 0, 0, 5],
                },
                {
                  text: 'Motivos de Atraso:',
                  style: 'regularTextBold',
                  margin: [10, 0, 0, 5],
                },
                {
                  ul: data.delayedTasks.delayReasons.map(
                    (reasonObj) => `${reasonObj.reason} - ${reasonObj.count} ocorrências`
                  ),
                  margin: [10, 0, 0, 0],
                },
              ],
            },
          ],
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
        objectiveCard: {
          margin: [0, 0, 0, 10],
        },
        objectiveTitle: {
          fontSize: 14,
          bold: true,
        },
        resultTitle: {
          fontSize: 12,
          bold: true,
        },
        regularText: {
          fontSize: 10,
        },
        regularTextBold: {
          fontSize: 10,
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