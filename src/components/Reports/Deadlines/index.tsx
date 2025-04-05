import React from 'react';
import pdfMake from 'pdfmake/build/pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(pdfMake as any).addVirtualFileSystem(pdfFonts);

// Interfaces dos dados retornados pela API
interface KeyResult {
  name: string;
  dueDate: string;
}

interface Objective {
  objectiveName: string;
  completionDate: string;
  keyResults: KeyResult[];
  completionPercentage: number;
}

interface DeadLines {
  projectId: number;
  projectName: string;
  objectives: Objective[];
}

const generateCircularChart = (percentage: number, radius = 40, color = '#4CAF50', backgroundColor = '#E0E0E0') => {
  const endAngle = (percentage / 100) * 360;
  return {
    stack: [
      {
        canvas: [
          { type: 'ellipse', x: radius, y: radius, r1: radius, r2: radius, lineWidth: 6, lineColor: backgroundColor },
          { type: 'ellipse', x: radius, y: radius, r1: radius, r2: radius, lineWidth: 6, lineColor: color, startAngle: 0, endAngle: endAngle },
        ],
        width: radius * 2,
        height: radius * 2,
        margin: [45, 0, 20, 0],
        alignment: 'right',
      },
      {
        text: `${percentage}%`,
        alignment: 'center',
        fontSize: 24,
        bold: true,
        margin: [(radius / 2 )-5, -radius -12, 0, 0],
      },
    ],
  };
};

export default function Deadlines() {
  const deadLines: DeadLines = {
    projectId: 1,
    projectName: 'Project Alpha',
    objectives: [
      {
        objectiveName: 'Increase market share',
        completionDate: '2024-06-30',
        keyResults: [
          { name: 'Expand into new regions', dueDate: '2024-05-15' },
          { name: 'Increase advertising budget', dueDate: '2024-06-01' },
        ],
        completionPercentage: 33,
      },
      {
        objectiveName: 'Improve customer satisfaction',
        completionDate: '2024-10-31',
        keyResults: [
          { name: 'Reduce response time', dueDate: '2024-08-15' },
          { name: 'Enhance support training', dueDate: '2024-09-10' },
        ],
        completionPercentage: 67,
      },
    ],
  };

  const generateDocDefinition = (data: DeadLines): TDocumentDefinitions => {
    return {
      content: [
        { text: 'TOCCA', style: 'header', alignment: 'center' },
        { text: `Prazos e datas importantes - ${data.projectName}`, style: 'title', alignment: 'center' },
        ...data.objectives.map((obj) => ({
          stack: [
            {
              canvas: [
                { type: 'rect', x: -10, y: 0, w: 530, h: 160, color: '#F0F0F0' },
              ],
              margin: [0, 0, 0, -160],
            },
            {
              columns: [
                { text: obj.objectiveName, style: 'cardTitle' },
                { text: `Data programada para a conclusão: ${new Date(obj.completionDate).toLocaleDateString('pt-BR')}`, style: 'date' },
              ],
              margin: [0, 10, 0, 5],
            },
            { text: 'Resultados Chaves', style: 'subTitle', alignment: 'left' },
            {
              columns: [
                {
                  table: {
                    headerRows: 1,
                    widths: ['*', 'auto'],
                    body: [
                      [
                        { text: 'Nome do Resultado', style: 'tableHeader', fillColor: '#F5F5F5', alignment: 'center' },
                        { text: 'Prazo', style: 'tableHeader', fillColor: '#F5F5F5', alignment: 'center' }
                      ],
                      ...obj.keyResults.map((kr) => [
                        { text: kr.name, margin: [5, 5], alignment: 'left' },
                        { text: new Date(kr.dueDate).toLocaleDateString('pt-BR'), margin: [5, 5], alignment: 'center' }
                      ]),
                    ],
                  },
                  layout: {
                    fillColor: (rowIndex) => (rowIndex % 2 === 0 ? '#FFFFFF' : '#F9F9F9'),
                    hLineWidth: () => 0.5,
                    vLineWidth: () => 0.5,
                    hLineColor: () => '#DDDDDD',
                    vLineColor: () => '#DDDDDD',
                  },
                  margin: [0, 5, 10, 5],
                },
                generateCircularChart(obj.completionPercentage),
              ],
            },
          ],
          style: 'card',
          margin: [0, 10],
        })),
      ],
      styles: {
        header: { fontSize: 22, bold: true, alignment: 'center' },
        title: { fontSize: 18, bold: true, margin: [0, 10] },
        cardTitle: { fontSize: 14, bold: true },
        date: { fontSize: 12, alignment: 'right' },
        subTitle: { fontSize: 12, bold: true, margin: [0, 10, 0, 5] },
        tableHeader: { bold: true, fontSize: 12 },
        card: {
          margin: [0, 10],
          padding: 10,
          border: [false, false, false, false],
          fillColor: '#FAFAFA',
        },
      },
    };
  };

  const gerarPDF = () => {
    const docDefinition = generateDocDefinition(deadLines);
    pdfMake.createPdf(docDefinition).download('relatorio-datas-importantes.pdf');
  };

  return (
    <button onClick={gerarPDF} className="bg-[#D8D8D8] text-center px-6 py-4 rounded-xl w-[430px] hover:bg-gray-400 transition h-[70px]">
      <h2 className="font-semibold text-lg mb-2">Prazos e Datas Importantes</h2>
    </button>
  );
}
