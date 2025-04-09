
import React, { useState, useEffect } from 'react';
import pdfMake from 'pdfmake/build/pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import logoTocca from '../../../assets/logoTocca.png';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(pdfMake as any).addVirtualFileSystem(pdfFonts);
interface KeyResult {
  name: string;
  dueDate: string;
}

interface Objective {
  objectiveName: string;
  completionDate: string | null;
  keyResults: KeyResult[];
  completionPercentage: number;
}

interface DeadLines {
  projectId: number;
  projectName: string;
  objectives: Objective[];
}

interface DeadlinesProps {
  selectedOkr: number;
  selectedYear: number;
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

export default function Deadlines({ selectedOkr, selectedYear }: Readonly<DeadlinesProps>) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logoBase64, setLogoBase64] = useState<string | null>(null);
  
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    convertImageToBase64();
  }, []);

  const convertImageToBase64 = () => {
    try {
      const imageUrl = typeof logoTocca === 'string' ? logoTocca : logoTocca.toString();
      
      if (imageUrl.startsWith('data:image')) {
        setLogoBase64(imageUrl);
        return;
      }
    
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

  const fetchDeadlinesData = async (): Promise<DeadLines | null> => {
    if (!selectedOkr || !user.companyId || !selectedYear) {
      setError("Por favor, selecione um OKR e um ano para gerar o relatório.");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/reports/deadlines`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: selectedOkr,
          year: selectedYear
        })
      });

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }

      const data: DeadLines = await response.json();
      return data;
    } catch (err) {
      console.error("Erro ao buscar dados de prazos:", err);
      setError(err instanceof Error ? err.message : "Erro ao buscar dados de prazos");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'Não definida';
    
    try {
      // Tenta converter para um objeto Date
      const date = new Date(dateString);
      
      // Verifica se a data é válida
      if (isNaN(date.getTime())) {
        return 'Data inválida';
      }
      
      // Formata a data para o padrão brasileiro
      return date.toLocaleDateString('pt-BR');
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return 'Erro na data';
    }
  };

  const generateDocDefinition = (data: DeadLines): TDocumentDefinitions => {
    return {
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 60],
      content: [
        // Logo em vez de texto
        logoBase64 
          ? { image: logoBase64, width: 150, alignment: 'center', margin: [0, 0, 0, 10] }
          : { text: 'TOCCA', style: 'header', alignment: 'center', color: '#E65100' },
        { text: `Prazos e datas importantes - ${data.projectName}`, style: 'title', alignment: 'center' },
        ...data.objectives
          .filter(obj => obj.keyResults.length > 0 || obj.completionDate) // Filtra objetivos sem resultados chave e sem data
          .map((obj) => ({
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
                  { text: `Data programada para a conclusão: ${formatDate(obj.completionDate)}`, style: 'date' },
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
                          { text: formatDate(kr.dueDate), margin: [5, 5], alignment: 'center' }
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
          fillColor: '#FAFAFA',
        },
      },
    };
  };

  const gerarPDF = async () => {
    try {
      setLoading(true);
      
      // Buscar dados da API
      const deadlinesData = await fetchDeadlinesData();
      
      if (!deadlinesData) {
        alert(error || "Não foi possível gerar o PDF. Verifique se um OKR está selecionado.");
        return;
      }
      
      // Gerar e baixar o PDF
      const docDefinition = generateDocDefinition(deadlinesData);
      pdfMake.createPdf(docDefinition).download(`Prazos_Datas_${deadlinesData.projectName}_${selectedYear}.pdf`);
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
        <h2 className="font-semibold text-lg mb-2">Prazos e Datas Importantes</h2>
      )}
    </button>
  );
}
