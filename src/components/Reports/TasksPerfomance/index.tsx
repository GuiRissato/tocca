/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import pdfMake from 'pdfmake/build/pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import logoTocca from '../../../assets/logoTocca.png';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(pdfMake as any).addVirtualFileSystem(pdfFonts);

// Interfaces dos dados retornados pela API
interface ColumnData {
  columnName: string;
  percentage: number;
  // color antes não vem do back, mas vamos adicionar pelo front:
  color?: string; 
}

interface PerformanceByObjective {
  objectiveName: string;
  columns: ColumnData[];
}

interface DelayedTasks {
  totalTasks: number;
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

interface TaskPerformanceProps {
  selectedOkr: number;
}

// Função para atribuir cor às colunas que não tenham cor
function assignColorsToColumns(objectives: PerformanceByObjective[]): PerformanceByObjective[] {
  // Ajuste essa paleta de cores conforme seu gosto
  const colorPalette = ['#F44336', '#2196F3', '#FFC107', '#4CAF50', '#9C27B0'];

  return objectives.map((obj) => {
    const columnsWithColor = obj.columns.map((col, index) => {
      // Se a coluna já tiver cor, não sobrescreve; senão, atribui da paleta
      if (!col.color) {
        return { ...col, color: colorPalette[index % colorPalette.length] };
      }
      return col;
    });
    return { ...obj, columns: columnsWithColor };
  });
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
        margin: [(radius / 2) - 8, -(radius * 2) + 22, 0, 0],
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
          w: (percentage / 100) * 500,
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

export default function TaskPerformance({ selectedOkr }: Readonly<TaskPerformanceProps>) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logoBase64, setLogoBase64] = useState<string | null>(null);
  
  const user = useSelector((state: RootState) => state.user);

  // Converter a imagem do logo para base64
  useEffect(() => {
    convertImageToBase64();
  }, []);

  // Função para converter a imagem importada para base64
  const convertImageToBase64 = () => {
    try {
      // Para TypeScript, precisamos garantir que o tipo seja tratado corretamente
      const imageUrl = typeof logoTocca === 'string' ? logoTocca : logoTocca.toString();
      
      // Se a imagem já for uma string base64 (como em algumas configurações de webpack)
      if (imageUrl.startsWith('data:image')) {
        setLogoBase64(imageUrl);
        return;
      }
      
      // Se for um caminho de arquivo, precisamos criar um elemento de imagem
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const dataURL = canvas.toDataURL('image/png');
          setLogoBase64(dataURL);
        }
      };
      img.src = imageUrl;
    } catch (err) {
      console.error("Erro ao converter a imagem para base64:", err);
    }
  };

  const fetchTaskPerformanceData = async (): Promise<TaskPerformanceData | null> => {
    if (!selectedOkr || !user.companyId) {
      setError("Por favor, selecione um OKR e um ano para gerar o relatório.");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.SITE_URL}/api/reports/taskPerformance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: selectedOkr
        })
      });

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }

      const data: TaskPerformanceData = await response.json();
      return data;
    } catch (err) {
      console.error("Erro ao buscar dados de desempenho de tarefas:", err);
      setError(err instanceof Error ? err.message : "Erro ao buscar dados de desempenho de tarefas");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Exemplo de docDefinition adaptado para o novo formato de dados, já com cor atribuída
  const generateDocDefinition = (data: TaskPerformanceData): TDocumentDefinitions => {
    // Primeiro atribuir cores às colunas, se necessário
    const updatedObjectives = assignColorsToColumns(data.performanceByObjective);

    return {
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 60],
      content: [
        // Logo em vez de texto
        logoBase64 
          ? { image: logoBase64, width: 150, alignment: 'center', margin: [0, 0, 0, 10] }
          : { text: 'TOCCA', style: 'header', alignment: 'center', color: '#E65100' },
        {
          text: `Desempenho das tarefas - ${data.projectName}`,
          style: 'subheader',
          alignment: 'center',
          margin: [0, 10, 0, 20],
        },
  
        // Mapeia cada objetivo
        ...updatedObjectives.map((obj) => {
          return {
            style: 'objectiveCard',
            table: {
              widths: ['*'],
              body: [
                [
                  {
                    stack: [
                      { text: `Objetivo: ${obj.objectiveName}`, style: 'objectiveTitle' },
                      { text: 'Resultados Chaves por coluna:',  style: 'resultTitle', margin: [0, 5, 0, 5] },
                      ...obj.columns.flatMap((col) => {
                        return [
                          { text: col.columnName, style: 'regularText' },
                          ...generateProgressBar(col.percentage, col.color ?? '#F44336'),
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
        }) as any,
  
        {
          text: 'Tarefas em Atraso',
          style: 'subheader',
          margin: [0, 10, 0, 10],
        },
        {
          columns: [
            {
              width: 'auto',
              stack: [
                generateCircularChart(
                  (data.delayedTasks.totalDelayedTasks / data.delayedTasks.totalTasks),
                  30,
                  '#F44336',
                  '#E0E0E0'
                ),
              ],
            },
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
                    (reasonObj) => `${reasonObj.reason}`
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

  const gerarPDF = async () => {
    try {
      setLoading(true);
      
      // Buscar dados da API
      const taskPerformanceData = await fetchTaskPerformanceData();
      
      if (!taskPerformanceData) {
        alert(error || "Não foi possível gerar o PDF. Verifique se um OKR está selecionado.");
        return;
      }
      
      // Gerar e baixar o PDF
      const docDefinition = generateDocDefinition(taskPerformanceData);
      pdfMake.createPdf(docDefinition).download(`Desempenho_Tarefas_${taskPerformanceData.projectName}_${new Date().getFullYear()}.pdf`);
    } catch (err) {
      console.error("Erro ao gerar PDF:", err);
      alert("Ocorreu um erro ao gerar o PDF. Por favor, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={gerarPDF} 
      className={`bg-[#D8D8D8] text-center px-6 py-4 rounded-xl w-[430px] hover:bg-gray-400 transition h-[70px] relative ${loading ? 'cursor-wait' : ''}`}
      disabled={loading}
    >
      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <h2 className="font-semibold text-lg mb-2">Desempenho das Tarefas</h2>
      )}
    </button>
  );
}
