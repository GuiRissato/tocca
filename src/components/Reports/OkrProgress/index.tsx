import { useEffect, useState } from 'react';
import pdfMake from 'pdfmake/build/pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

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

// Sample colors for objectives and key results
const objectiveColors = ['#2F80ED', '#F2994A', '#F2C94C', '#6FCF97', '#9B51E0'];
const keyResultColors = ['#BBDEFB', '#2F80ED', '#90CAF9', '#81C784', '#E57373'];

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

interface OkrProgressProps {
  selectedOkr: number;
  selectedYear: number;
}

export default function OKRProgress({selectedOkr, selectedYear}: Readonly<OkrProgressProps>) {
  const [loading, setLoading] = useState(false);
  const [okrData, setOkrData] = useState<OkrData | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    setOkrData(null);
    setError(null);
  }, [selectedOkr, selectedYear]);

  const fetchOkrData = async () => {
    if (!selectedOkr || !user.companyId || !selectedYear) {
      setError("Por favor, selecione um OKR e um ano para gerar o relatório.");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      
      const progressPDFDataResponse = await fetch(`/api/reports/progress`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: selectedOkr,
          year: selectedYear
        })
      });

      const data = await progressPDFDataResponse.json()
      console.log(data)
      setOkrData(data)
    } catch (err) {
      console.error("Erro ao buscar dados do OKR:", err);
      setError(err instanceof Error ? err.message : "Erro ao buscar dados do OKR");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const gerarPDF = async () => {
    // If we don't have data yet, fetch it
    const data = okrData || await fetchOkrData();
    
    if (!data) {
      alert(error || "Não foi possível gerar o PDF. Verifique se um OKR está selecionado.");
      return;
    }

    const docDefinition: TDocumentDefinitions = {
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 40],
      content: [
        { text: 'TOCCA', style: 'header', alignment: 'center', color: '#E65100' },
        { text: `Progresso do OKR ${data.projectName}`, margin: [0, 20, 0, 20], alignment: 'center' },
        { text: 'Objetivos', style: 'subheader', margin: [0, 10, 0, 5], alignment: 'center'},
        ...(data.objectives.length > 0 
          ? data.objectives.flatMap(obj => [
              { text: obj.objectiveName, bold: true },
              ...generateProgressBar(obj.progress, obj.color),
            ])
          : [{ text: 'Nenhum objetivo encontrado', italics: true, alignment: 'center' }]
        ),
        { text: 'Resultados Chaves', style: 'subheader', margin: [0, 20, 0, 5], alignment: 'center' },
        ...(data.keyResults.length > 0
          ? data.keyResults.flatMap(kr => [
              { text: kr.columnName, bold: true },
              ...generateProgressBar(kr.percentage, kr.color),
            ])
          : [{ text: 'Nenhum resultado chave encontrado', italics: true, alignment: 'center' }]
        ),
      ],
      styles: {
        header: { fontSize: 22, bold: true },
        subheader: { fontSize: 16, bold: true },
      },
    };

    pdfMake.createPdf(docDefinition).download(`OKR_${data.projectName}_${selectedYear}.pdf`);
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
        <h2 className="font-semibold text-lg mb-2">Progresso do OKR</h2>
      )}
    </button>
  );
}