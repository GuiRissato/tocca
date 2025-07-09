/* eslint-disable react-hooks/exhaustive-deps */
import HeaderLayout from '@/components/HeaderLayout';
import OKRGrid from '../../components/OKRGrid';
import { useEffect, useState } from 'react';
import SelectYearButton from '@/components/SelectYearButton';
import { RootState, wrapper } from '@/store';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from '../login';
import { GetServerSidePropsResult } from 'next';
import { useSelector } from 'react-redux';
import { UserState } from '@/store/userSlice';

type OKRPageProps = {
  initialYear?: number;
  availableYears?: number[];
  error?: string;
};

export interface OkrProject {
  project: {
    id: number;
    company_id: number;
    project_name: string;
    description: string;
    created_at: string;
    updated_at: string;
  };
  objectivesProgress: number;
  keyResultsProgress: number;
}

// Função para construir URL base mais robusta
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getBaseUrl(req: any): string {
  if (process.env.NODE_ENV === 'production') {
    // Em produção, use a URL do Vercel
    return `https://${req.headers.host}`;
  }
  
  // Em desenvolvimento
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const host = req.headers.host;
  return `${protocol}://${host}`;
}

export const getServerSideProps = wrapper.getServerSideProps(
  () =>
    async (
      context
    ): Promise<
      GetServerSidePropsResult<{
        initialYear?: number;
        availableYears?: number[];
        error?: string;
      }>
    > => {
      let userJwt: DecodedToken | null = null;

      // Verificar se existe JWT e se é válido
      if (!context.req.cookies.userJWT) {
        return {
          redirect: {
            destination: '/login',
            permanent: false,
          },
        };
      }

      try {
        const parsedCookies: DecodedToken = jwtDecode(context.req.cookies.userJWT);
        userJwt = parsedCookies;
        
        // Verificar se o token não expirou
        if (userJwt.exp && userJwt.exp * 1000 < Date.now()) {
          return {
            redirect: {
              destination: '/login',
              permanent: false,
            },
          };
        }
      } catch (error) {
        console.error('Erro ao decodificar JWT:', error);
        return {
          redirect: {
            destination: '/login',
            permanent: false,
          },
        };
      }

      try {
        const baseUrl = getBaseUrl(context.req);
        
        console.log('Base URL:', baseUrl); // Debug
        console.log('Company ID:', userJwt?.user.companyId); // Debug

        const response = await fetch(
          `${baseUrl}/api/okr/years?companyId=${userJwt?.user.companyId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Cookie': context.req.headers.cookie || '', // Passar cookies para a API
            },
          }
        );

        console.log('Response status:', response.status); // Debug

        if (!response.ok) {
          throw new Error(`Erro: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log('API Response:', data); // Debug

        const availableYears = Array.isArray(data) ? data : [];
        const initialYear = availableYears.length > 0 ? availableYears[0] : new Date().getFullYear();

        return {
          props: {
            initialYear,
            availableYears,
          },
        };
      } catch (error: unknown) {
        console.error('Erro na requisição:', error);
        return {
          props: {
            error: error instanceof Error ? error.message : 'Ocorreu um erro na requisição.',
          },
        };
      }
    }
);

export async function fetchOkrs(
  user: UserState,
  setOkrs: React.Dispatch<React.SetStateAction<OkrProject[]>>
) {
  try {
    if (user?.companyId != null) {
      console.log('Fetching OKRs for company:', user.companyId); // Debug
      
      const response = await fetch(`/api/okr/${user.companyId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('OKRs fetch response status:', response.status); // Debug

      if (!response.ok) {
        throw new Error(`Erro ao buscar OKRs: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Response from /api/okr:', data);
      setOkrs(data);
    }
  } catch (error) {
    console.error('Erro ao buscar OKRs:', error);
  }
}

export default function OKRPage({
  initialYear,
  availableYears,
  error,
}: Readonly<OKRPageProps>) {
  const user = useSelector((state: RootState) => state.user);

  const [selectedYear, setSelectedYear] = useState<number>(
    initialYear ?? new Date().getFullYear()
  );
  const [okrs, setOkrs] = useState<OkrProject[]>([]);

  useEffect(() => {
    if (user?.companyId) {
      fetchOkrs(user, setOkrs);
    }
  }, [user?.companyId]);

  if (error) {
    return (
      <HeaderLayout>
        <div className="container mx-auto pt-[60px] mt-10 mb-10">
          <p className="text-red-500 font-semibold">
            Ocorreu um erro ao carregar a página: {error}
          </p>
        </div>
      </HeaderLayout>
    );
  }

  return (
    <HeaderLayout>
      <div className="container mx-auto pt-[60px] mt-10 mb-10">
        <header className="mb-4">
          <SelectYearButton
            years={availableYears ?? []}
            setSelectedYear={setSelectedYear}
            selectedYear={selectedYear}
          />
        </header>
        <OKRGrid okrs={okrs} setOkrs={setOkrs} />
      </div>
    </HeaderLayout>
  );
}