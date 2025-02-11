import pdfMake from 'pdfmake/build/pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(pdfMake as any).addVirtualFileSystem(pdfFonts);

interface Objective {
  objectiveName: string;
  progress: number;
  color: string;
}

interface KeyResult {
  columnName: string;
  percentage: number;
  color: string;
}

interface OkrData {
  projectId: number;
  projectName: string;
  objectives: Objective[];
  keyResults: KeyResult[];
}

const okrSampleData: OkrData = {
  projectId: 1,
  projectName: 'Novo Projeto Refatorado',
  objectives: [
    { objectiveName: 'Objetivo X', progress: 70, color: '#2F80ED' },
    { objectiveName: 'Objetivo Y', progress: 40, color: '#F2994A' },
    { objectiveName: 'Objetivo Z', progress: 30, color: '#F2C94C' },
  ],
  keyResults: [
    { columnName: 'Para Fazer', percentage: 70, color: '#BBDEFB' },
    { columnName: 'Pendente', percentage: 40, color: '#2F80ED' },
    { columnName: 'Em Progresso', percentage: 30, color: '#90CAF9' },
    { columnName: 'Finalizadas', percentage: 20, color: '#81C784' },
    { columnName: 'Fechadas', percentage: 20, color: '#E57373' },
  ],
};

const generateProgressBar = (percentage: number, color: string) => [
  {
    canvas: [
      {
        type: 'rect',
        x: 0,
        y: 0,
        w: 500,
        h: 10,
        color: '#E0E0E0',
      },
      {
        type: 'rect',
        x: 0,
        y: 0,
        w: (percentage / 100) * 200,
        h: 10,
        color: color,
      },
    ],
  },
  { text: `${percentage}%`, margin: [0, 5, 0, 10] },
];

const docDefinition: TDocumentDefinitions = {
  pageSize: 'A4',
  pageMargins: [40, 60, 40, 40],
  content: [
    { text: 'TOCCA', style: 'header', alignment: 'center', color: '#E65100' },
    { text: `Progresso do OKR ${okrSampleData.projectName}`, margin: [0, 20, 0, 20], alignment: 'center' },
    { text: 'Objetivos', style: 'subheader', margin: [0, 10, 0, 5], alignment: 'center'},
    ...okrSampleData.objectives.flatMap(obj => [
      { text: obj.objectiveName, bold: true },
      ...generateProgressBar(obj.progress, obj.color),
    ]),
    { text: 'Resultados Chaves', style: 'subheader', margin: [0, 20, 0, 5], alignment: 'center' },
    ...okrSampleData.keyResults.flatMap(kr => [
      { text: kr.columnName, bold: true },
      ...generateProgressBar(kr.percentage, kr.color),
    ]),
  ],
  styles: {
    header: { fontSize: 22, bold: true },
    subheader: { fontSize: 16, bold: true },
  },
};

export default function OKRProgress() {
  const gerarPDF = () => {
    pdfMake.createPdf(docDefinition as TDocumentDefinitions).download();
  };
  return (
    <div>
      <h1>Relatório OKR Progress</h1>
      <button onClick={gerarPDF}>Gerar PDF</button>
    </div>
  );
}
